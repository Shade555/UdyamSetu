import { useState } from "react";
import { ArrowLeft, Calculator, AlertCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { calculateEMI, type EMICalculationResponse } from "../services/api";
import { formatCurrency } from "../lib/utils";

type SelectedScheme = { schemeId: string; schemeName: string };

export default function EMICalculator() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedScheme = location.state as SelectedScheme | null;
  const [loanAmount, setLoanAmount] = useState("");
  const [repaymentPeriod, setRepaymentPeriod] = useState("");
  const [moratorium, setMoratorium] = useState("0");
  const [projectCost, setProjectCost] = useState("");
  const [frequency, setFrequency] = useState("");
  const [lendingChannel, setLendingChannel] = useState("");
  const [interestCase, setInterestCase] = useState("");
  const [repaymentStarted, setRepaymentStarted] = useState("");
  const [coursePeriodMonths, setCoursePeriodMonths] = useState("12");
  const [result, setResult] = useState<EMICalculationResponse | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!selectedScheme) {
    return (
      <section className="space-y-5">
        <h1 className="text-3xl font-bold">EMI & Repayment Calculator</h1>
        <div className="card flex items-start gap-3 text-red-400">
          <AlertCircle size={18} />
          <p>
            Select a scheme from Scheme Recommendations before opening this
            page.
          </p>
        </div>
        <button
          className="btn-secondary flex items-center gap-2"
          onClick={() => navigate("/home")}
        >
          <ArrowLeft size={16} /> Back to Home
        </button>
      </section>
    );
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setResult(null);
    setSubmitting(true);

    try {
      const response = await calculateEMI({
        scheme_id: selectedScheme.schemeId,
        loan_amount: Number(loanAmount),
        repayment_period: Number(repaymentPeriod),
        moratorium: Number(moratorium),
        project_cost: projectCost ? Number(projectCost) : undefined,
        repayment_frequency: frequency || undefined,
        lending_channel: lendingChannel || undefined,
        interest_case: interestCase || undefined,
        repayment_started: repaymentStarted
          ? repaymentStarted === "true"
          : undefined,
        course_period_months: coursePeriodMonths
          ? Number(coursePeriodMonths)
          : undefined,
      });
      setResult(response);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to calculate repayment.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const isUny = selectedScheme.schemeId === "UNY";
  const isEls = selectedScheme.schemeId === "ELS";

  return (
    <section className="space-y-8">
      <div>
        <button
          type="button"
          className="mb-5 flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900"
          onClick={() =>
            navigate("/home/scheme-details", { state: selectedScheme })
          }
        >
          <ArrowLeft size={16} /> Back to Scheme Details
        </button>
        <p className="text-sm font-semibold uppercase tracking-wide text-accent-700">
          Step 7
        </p>
        <h1 className="mt-2 text-3xl font-bold">EMI & Repayment Calculator</h1>
        <p className="mt-2 text-neutral-600">{selectedScheme.schemeName}</p>
      </div>

      <form onSubmit={submit} className="card grid gap-5 md:grid-cols-2">
        <Field
          label="Loan amount"
          value={loanAmount}
          onChange={setLoanAmount}
        />
        <Field
          label="Repayment period (months)"
          value={repaymentPeriod}
          onChange={setRepaymentPeriod}
        />
        <Field
          label="Moratorium (months)"
          value={moratorium}
          onChange={setMoratorium}
        />
        <Field
          label={isEls ? "Course fee" : "Project cost (optional)"}
          value={projectCost}
          onChange={setProjectCost}
          required={isEls}
        />

        {isUny && (
          <>
            <Select
              label="Lending channel"
              value={lendingChannel}
              onChange={setLendingChannel}
              options={["Cooperative Banks/Societies", "SFBs"]}
            />
            <Select
              label="Repayment frequency"
              value={frequency}
              onChange={setFrequency}
              options={["quarterly", "half-yearly"]}
            />
          </>
        )}
        {isEls && (
          <>
            <Select
              label="Interest case"
              value={interestCase}
              onChange={setInterestCase}
              options={["beneficiary", "ca"]}
            />
            <Select
              label="Has repayment started?"
              value={repaymentStarted}
              onChange={setRepaymentStarted}
              options={["true", "false"]}
              optionLabels={["Yes", "No"]}
            />
            {repaymentStarted === "false" && (
              <Field
                label="Course period (months)"
                value={coursePeriodMonths}
                onChange={setCoursePeriodMonths}
              />
            )}
          </>
        )}

        {error && (
          <div className="md:col-span-2 flex items-start gap-3 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-300">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary md:col-span-2 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Calculator size={18} />{" "}
          {submitting ? "Calculating..." : "Calculate EMI"}
        </button>
      </form>

      {isEls && (
        <p className="text-sm text-neutral-500">
          ELS repayment frequency is not specified in the project data. The API
          will validate this rather than inventing a frequency.
        </p>
      )}
      {result && <Results result={result} />}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  required = true,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="space-y-2 text-sm font-medium">
      {label}
      <input
        required={required}
        min="0"
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="input-base"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  optionLabels = options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  optionLabels?: string[];
}) {
  return (
    <label className="space-y-2 text-sm font-medium">
      {label}
      <select
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="input-base"
      >
        <option value="">Select...</option>
        {options.map((option, index) => (
          <option key={option} value={option}>
            {optionLabels[index]}
          </option>
        ))}
      </select>
    </label>
  );
}

function Results({ result }: { result: EMICalculationResponse }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Summary
          label={`Installment / ${result.repayment_frequency}`}
          value={formatCurrency(result.emi)}
        />
        <Summary
          label="Total interest"
          value={formatCurrency(result.total_interest)}
        />
        <Summary
          label="Total repayment"
          value={formatCurrency(result.total_repayment)}
        />
      </div>
      <p className="text-sm text-neutral-600">
        {result.repayment_periods} repayment periods ·{" "}
        {result.repayment_period_months} months · moratorium{" "}
        {result.moratorium_months} months
      </p>
      <div className="card overflow-x-auto">
        <h2 className="mb-4 text-xl font-bold">Repayment graph</h2>
        <BalanceGraph result={result} />
      </div>
      <div className="card overflow-x-auto">
        <h2 className="mb-4 text-xl font-bold">Repayment schedule</h2>
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-300 text-neutral-500">
              <th className="pb-3">Period</th>
              <th className="pb-3">Payment</th>
              <th className="pb-3">Principal</th>
              <th className="pb-3">Interest</th>
              <th className="pb-3">Remaining balance</th>
            </tr>
          </thead>
          <tbody>
            {result.schedule.map((row) => (
              <tr key={row.period} className="border-b border-neutral-200">
                <td className="py-3">{row.period}</td>
                <td>{formatCurrency(row.payment)}</td>
                <td>{formatCurrency(row.principal)}</td>
                <td>{formatCurrency(row.interest)}</td>
                <td>{formatCurrency(row.remaining_balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-neutral-500">{result.assumptions.join(" ")}</p>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function BalanceGraph({ result }: { result: EMICalculationResponse }) {
  const max = Math.max(
    ...result.schedule.map((row) => row.remaining_balance),
    1,
  );
  const points = result.schedule
    .map(
      (row, index) =>
        `${10 + (index / Math.max(result.schedule.length - 1, 1)) * 700},${190 - (row.remaining_balance / max) * 160}`,
    )
    .join(" ");
  return (
    <svg
      viewBox="0 0 720 220"
      className="min-w-[620px] w-full"
      role="img"
      aria-label="Remaining loan balance over time"
    >
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        points={points}
      />
      <line
        x1="10"
        y1="190"
        x2="710"
        y2="190"
        stroke="currentColor"
        opacity=".2"
      />
    </svg>
  );
}
