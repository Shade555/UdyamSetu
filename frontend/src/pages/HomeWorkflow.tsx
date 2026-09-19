import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

const steps = [
  {
    number: 5,
    label: "Scheme Recommendations",
    path: "/home/scheme-recommendations",
  },
  {
    number: 6,
    label: "Scheme Details & Documents",
    path: "/home/scheme-details",
  },
  {
    number: 7,
    label: "EMI & Repayment Calculator",
    path: "/home/emi-calculator",
  },
  { number: 8, label: "Partner Locator", path: "/home/partner-locator" },
  {
    number: 9,
    label: "Partner Eligibility",
    path: "/home/partner-eligibility",
  },
  { number: 10, label: "Official Next Action", path: "/home/official-action" },
];

const schemes = [
  { schemeId: "MFS", schemeName: "Micro Finance Scheme (MFS)" },
  { schemeId: "TERM_LOAN", schemeName: "Term Loan" },
  {
    schemeId: "AMY",
    schemeName: "Aajeevika Micro-Finance Yojana (AMY)",
  },
  { schemeId: "UNY", schemeName: "Udyam Nidhi Yojana (UNY)" },
  { schemeId: "ELS", schemeName: "Educational Loan Scheme (ELS)" },
];

export default function HomeWorkflow({ activeStep }: { activeStep?: number }) {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedScheme = location.state as {
    schemeId: string;
    schemeName: string;
  } | null;
  const currentIndex = Math.max(
    0,
    steps.findIndex((step) => step.number === activeStep),
  );
  const currentStep = steps[currentIndex];

  if (activeStep) {
    return (
      <section className="space-y-8">
        <div>
          <button
            type="button"
            className="mb-5 flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900"
            onClick={() => navigate("/home", { state: selectedScheme })}
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-700">
            Step {activeStep}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-neutral-900">
            This is the {currentStep.label} page
          </h1>
        </div>

        <StepProgress activeStep={activeStep} />

        <div className="flex justify-between gap-4">
          <button
            type="button"
            className="btn-secondary flex items-center gap-2"
            disabled={currentIndex === 0}
            onClick={() =>
              navigate(steps[currentIndex - 1].path, { state: selectedScheme })
            }
          >
            <ArrowLeft size={16} />
            Previous
          </button>
          <button
            type="button"
            className="btn-primary flex items-center gap-2"
            disabled={currentIndex === steps.length - 1}
            onClick={() =>
              navigate(steps[currentIndex + 1].path, { state: selectedScheme })
            }
          >
            Next
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-accent-700">
          UdyamSetu
        </p>
        <h1 className="mt-2 text-3xl font-bold text-neutral-900">
          Your journey
        </h1>
        <p className="mt-2 text-neutral-600">
          Choose a scheme to begin the next steps.
        </p>
      </div>

      <StepProgress />

      <div>
        <h2 className="mb-4 text-xl font-bold text-neutral-900">
          Scheme Recommendations
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {schemes.map((scheme) => (
            <button
              key={scheme.schemeId}
              type="button"
              className="card text-left hover:border-accent-400"
              onClick={() =>
                navigate("/home/scheme-details", {
                  state: {
                    schemeId: scheme.schemeId,
                    schemeName: scheme.schemeName,
                  },
                })
              }
            >
              <span className="text-sm font-semibold text-accent-700">
                Recommended scheme
              </span>
              <span className="mt-3 block font-bold text-neutral-900">
                {scheme.schemeName}
              </span>
              <span className="mt-5 block text-sm text-accent-700">
                View details <ArrowRight className="inline" size={15} />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepProgress({ activeStep = 5 }: { activeStep?: number }) {
  return (
    <nav aria-label="Journey progress" className="overflow-x-auto">
      <ol className="flex min-w-[720px] items-start">
        {steps.map((step, index) => (
          <li key={step.number} className="flex flex-1 items-start">
            <NavLink
              to={step.path}
              className="group flex min-w-0 flex-1 flex-col items-center text-center"
            >
              <span
                aria-label={step.label}
                className={`flex h-3 w-3 items-center justify-center rounded-full border-2 ${
                  step.number <= activeStep
                    ? "border-accent-600 bg-accent-600 text-white"
                    : "border-neutral-300 bg-white text-neutral-500"
                }`}
              />
              <span className="mt-2 text-xs font-medium text-neutral-600 group-hover:text-accent-700">
                {step.label}
              </span>
            </NavLink>
            {index < steps.length - 1 && (
              <span
                className={`mt-1.5 h-0.5 flex-1 ${step.number < activeStep ? "bg-accent-600" : "bg-neutral-200"}`}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
