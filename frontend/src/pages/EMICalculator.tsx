import { useEffect, useState } from "react";
import { ArrowLeft, Calculator, AlertCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { calculateEMI, type EMICalculationResponse } from "../services/api";
import { formatCurrency } from "../lib/utils";
import { getSchemeByCode } from "../lib/supabase";

type SelectedScheme = { schemeId: string; schemeName: string };

export default function EMICalculator() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedScheme = location.state as SelectedScheme | null;
  const [loanAmount, setLoanAmount] = useState("");
  const [maximumLoanAmount, setMaximumLoanAmount] = useState<number | null>(
    null,
  );
  const [schemeLimitError, setSchemeLimitError] = useState("");
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

  useEffect(() => {
    if (!selectedScheme?.schemeId) return;

    let cancelled = false;
    setMaximumLoanAmount(null);
    setSchemeLimitError("");

    getSchemeByCode(selectedScheme.schemeId)
      .then((scheme) => {
        if (cancelled) return;
        const limit = Number(scheme?.max_amount);
        if (!scheme || !Number.isFinite(limit) || limit <= 0) {
          setSchemeLimitError(
            "The selected scheme maximum loan amount is unavailable.",
          );
          return;
        }
        setMaximumLoanAmount(limit);
        setLoanAmount((current) => {
          const currentAmount = Number(current);
          return current && currentAmount <= limit ? current : "0";
        });
      })
      .catch(() => {
        if (!cancelled)
          setSchemeLimitError(
            "We could not load the selected scheme loan limit.",
          );
      });

    return () => {
      cancelled = true;
    };
  }, [selectedScheme?.schemeId]);

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
  const updateLoanAmount = (value: string) => {
    if (value === "") {
      setLoanAmount("");
      return;
    }
    const amount = Number(value);
    if (!Number.isFinite(amount)) return;
    setLoanAmount(
      String(Math.min(Math.max(0, amount), maximumLoanAmount ?? amount)),
    );
  };

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
        <LoanAmountField
          value={loanAmount}
          maximum={maximumLoanAmount}
          error={schemeLimitError}
          onChange={updateLoanAmount}
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
          className="btn-primary md:col-span-2 flex items-center justify-center gap-2 border border-neutral-700 bg-neutral-800 text-neutral-100 hover:bg-neutral-700 disabled:opacity-50"
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
        className="input-base border-neutral-700 bg-neutral-900 text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-500 focus:ring-neutral-700"
      />
    </label>
  );
}

function LoanAmountField({
  value,
  maximum,
  error,
  onChange,
}: {
  value: string;
  maximum: number | null;
  error: string;
  onChange: (value: string) => void;
}) {
  const numericValue = Number(value || 0);
  const sliderStep = maximum ? Math.max(1, Math.round(maximum / 1000)) : 1;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor="loan-amount-slider" className="text-sm font-medium">
          Loan amount
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-500">₹</span>
          <input
            aria-label="Loan amount value"
            type="number"
            min="0"
            max={maximum ?? undefined}
            step="1"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            disabled={maximum === null}
            className="w-32 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-right text-sm text-neutral-100 outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-700 disabled:opacity-50"
          />
        </div>
      </div>
      <input
        id="loan-amount-slider"
        aria-label="Loan amount slider"
        type="range"
        min="0"
        max={maximum ?? 0}
        step={sliderStep}
        value={Math.min(numericValue, maximum ?? 0)}
        onChange={(event) => onChange(event.target.value)}
        disabled={maximum === null}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-neutral-800 accent-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <div className="flex justify-between text-xs text-neutral-500">
        <span>₹0</span>
        <span>
          {maximum === null
            ? "Loading maximum..."
            : `Maximum: ${formatCurrency(maximum)}`}
        </span>
      </div>
      {error && <p className="text-xs text-red-300">{error}</p>}
    </div>
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
        className="input-base border-neutral-700 bg-neutral-900 text-neutral-100 focus:border-neutral-500 focus:ring-neutral-700"
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
  const [hoveredPeriod, setHoveredPeriod] = useState<number | null>(null);
  const width = 900;
  const height = 430;
  const margin = { top: 42, right: 78, bottom: 72, left: 82 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const periodsPerYear =
    result.repayment_frequency === "monthly"
      ? 12
      : result.repayment_frequency === "half-yearly"
        ? 2
        : 4;
  const monthsPerPeriod = 12 / periodsPerYear;
  const paymentMonths = result.schedule.map(
    (row) => result.moratorium_months + row.period * monthsPerPeriod,
  );
  const totalMonths = Math.max(
    result.repayment_period_months,
    paymentMonths[paymentMonths.length - 1] || 0,
  );
  const paymentMax = Math.max(
    ...result.schedule.map((row) => row.payment),
    1,
  );
  const balanceMax = Math.max(result.loan_amount, 1);
  const x = (month: number) =>
    margin.left + (month / totalMonths) * plotWidth;
  const paymentY = (amount: number) =>
    margin.top + plotHeight - (amount / paymentMax) * plotHeight;
  const balanceY = (amount: number) =>
    margin.top + plotHeight - (amount / balanceMax) * plotHeight;
  const barWidth = Math.max(
    8,
    Math.min(24, (monthsPerPeriod / totalMonths) * plotWidth * 0.6),
  );
  const moratoriumWidth =
    Math.min(result.moratorium_months / totalMonths, 1) * plotWidth;
  const hovered =
    hoveredPeriod === null ? null : result.schedule[hoveredPeriod];
  const gridTicks = [0, 0.25, 0.5, 0.75, 1];
  const xLabels = Array.from(
    new Set([
      0,
      result.moratorium_months,
      ...paymentMonths.filter((month) => month <= totalMonths),
      totalMonths,
    ]),
  );

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="min-w-[720px] w-full text-neutral-500"
      role="img"
      aria-label="Principal and interest payments with remaining balance over time"
    >
      {gridTicks.map((tick) => {
        const yPosition = margin.top + plotHeight - tick * plotHeight;
        return (
          <g key={tick}>
            <line
              x1={margin.left}
              y1={yPosition}
              x2={width - margin.right}
              y2={yPosition}
              stroke="#303030"
            />
            <text
              x={margin.left - 12}
              y={yPosition + 4}
              textAnchor="end"
              fontSize="11"
              fill="#999"
            >
              {formatCurrency(paymentMax * tick)}
            </text>
            <text
              x={width - margin.right + 12}
              y={yPosition + 4}
              textAnchor="start"
              fontSize="11"
              fill="#999"
            >
              {formatCurrency(balanceMax * tick)}
            </text>
          </g>
        );
      })}

      {result.moratorium_months > 0 && (
        <g>
          <rect
            x={margin.left}
            y={margin.top}
            width={moratoriumWidth}
            height={plotHeight}
            fill="#9a7b38"
            opacity=".14"
          />
          <text
            x={margin.left + 8}
            y={margin.top + 16}
            fontSize="11"
            fill="#c9a85d"
          >
            Moratorium ({result.moratorium_months} months)
          </text>
        </g>
      )}

      {result.schedule.map((row, index) => {
        const barX = x(paymentMonths[index]) - barWidth / 2;
        const principalY = paymentY(row.principal);
        const totalPaymentY = paymentY(row.payment);
        const principalHeight = margin.top + plotHeight - principalY;
        const interestHeight = principalY - totalPaymentY;
        return (
          <g
            key={row.period}
            onMouseEnter={() => setHoveredPeriod(index)}
            onMouseLeave={() => setHoveredPeriod(null)}
          >
            <rect
              x={barX}
              y={principalY}
              width={barWidth}
              height={principalHeight}
              fill="#d4d4d4"
              opacity=".9"
            />
            <rect
              x={barX}
              y={totalPaymentY}
              width={barWidth}
              height={interestHeight}
              fill="#737373"
              opacity=".95"
            />
            <rect
              x={barX}
              y={margin.top}
              width={barWidth}
              height={plotHeight}
              fill="transparent"
              className="cursor-crosshair"
            />
          </g>
        );
      })}

      <polyline
        fill="none"
        stroke="#f4f4f5"
        strokeWidth="2.5"
        points={result.schedule
          .map(
            (row, index) =>
              `${x(paymentMonths[index])},${balanceY(row.remaining_balance)}`,
          )
          .join(" ")}
      />
      {result.schedule.map((row, index) => (
        <circle
          key={`balance-${row.period}`}
          cx={x(paymentMonths[index])}
          cy={balanceY(row.remaining_balance)}
          r="3"
          fill="#f4f4f5"
        />
      ))}

      <line
        x1={margin.left}
        y1={margin.top + plotHeight}
        x2={width - margin.right}
        y2={margin.top + plotHeight}
        stroke="#555"
      />
      {xLabels.map((month) => (
        <text
          key={`month-${month}`}
          x={x(month)}
          y={height - 42}
          textAnchor="middle"
          fontSize="11"
          fill="#999"
        >
          {Math.round(month)}
        </text>
      ))}
      <text
        x={margin.left + plotWidth / 2}
        y={height - 12}
        textAnchor="middle"
        fontSize="12"
        fill="#aaa"
      >
        Months
      </text>
      <text
        x="16"
        y={margin.top + plotHeight / 2}
        textAnchor="middle"
        fontSize="12"
        fill="#aaa"
        transform={`rotate(-90 16 ${margin.top + plotHeight / 2})`}
      >
        Payment / Principal / Interest (₹)
      </text>
      <text
        x={width - 16}
        y={margin.top + plotHeight / 2}
        textAnchor="middle"
        fontSize="12"
        fill="#aaa"
        transform={`rotate(90 ${width - 16} ${margin.top + plotHeight / 2})`}
      >
        Remaining Balance (₹)
      </text>

      <g transform={`translate(${margin.left}, 12)`}>
        <rect width="12" height="12" fill="#d4d4d4" />
        <text x="18" y="11" fontSize="11" fill="#bbb">
          Principal Paid
        </text>
        <rect x="126" width="12" height="12" fill="#737373" />
        <text x="144" y="11" fontSize="11" fill="#bbb">
          Interest Paid
        </text>
        <line
          x1="270"
          y1="6"
          x2="286"
          y2="6"
          stroke="#f4f4f5"
          strokeWidth="2.5"
        />
        <text x="294" y="11" fontSize="11" fill="#bbb">
          Remaining Balance
        </text>
      </g>

      {hovered && hoveredPeriod !== null && (
        <g
          pointerEvents="none"
          transform={`translate(${Math.min(x(paymentMonths[hoveredPeriod]) + 12, width - 190)}, ${Math.max(balanceY(hovered.remaining_balance) - 92, margin.top + 8)})`}
        >
          <rect
            width="178"
            height="82"
            rx="5"
            fill="#202020"
            stroke="#4a4a4a"
          />
          <text x="10" y="17" fontSize="11" fill="#f4f4f5">
            Month {Math.round(hovered.period * monthsPerPeriod)}
          </text>
          <text x="10" y="33" fontSize="10" fill="#bdbdbd">
            Principal: {formatCurrency(hovered.principal)}
          </text>
          <text x="10" y="48" fontSize="10" fill="#bdbdbd">
            Interest: {formatCurrency(hovered.interest)}
          </text>
          <text x="10" y="63" fontSize="10" fill="#bdbdbd">
            Payment: {formatCurrency(hovered.payment)}
          </text>
          <text x="10" y="78" fontSize="10" fill="#bdbdbd">
            Balance: {formatCurrency(hovered.remaining_balance)}
          </text>
        </g>
      )}
    </svg>
  );
}
