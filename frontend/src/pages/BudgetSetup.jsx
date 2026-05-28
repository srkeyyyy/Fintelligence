import { useNavigate } from "react-router-dom";
import BudgetSection from "../components/budgets/BudgetSection";

function BudgetSetup() {
  const navigate = useNavigate();

  const handleSkip = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-[#0f172a] px-5 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Setup your first budget</h1>
            <p className="mt-2 text-slate-400">Create one guardrail now, or skip into the product.</p>
          </div>
          <button
            onClick={handleSkip}
            className="rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-white/[0.08]"
            type="button"
          >
            Skip setup
          </button>
        </div>
        <BudgetSection />
        <button
          className="premium-action mt-6 rounded-lg px-5 py-3 font-bold text-slate-950"
          onClick={() => navigate("/home")}
          type="button"
        >
          Continue to workspace
        </button>
      </div>
    </div>
  );
}

export default BudgetSetup;
