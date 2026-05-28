import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { createBudget, deleteBudget, getBudgets } from "../../services/budget.service";
import { getBudgetStatus } from "../../services/analytics.service";
import CurrencyLoader from "../common/CurrencyLoader";

const month = new Date().getMonth() + 1;
const year = new Date().getFullYear();

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);

function BudgetSection() {
  const [budgets, setBudgets] = useState([]);
  const [budgetsLoading, setBudgetsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ categoryBudgets: [], monthlyBudgets: [] });
  const [form, setForm] = useState({
    amount: "",
    category: "",
    month,
    name: "Monthly plan",
    type: "monthly",
    year,
  });

  const loadBudgets = () =>
    Promise.all([getBudgets(), getBudgetStatus()])
      .then(([budgetData, statusData]) => {
        setBudgets(budgetData);
        setStatus(statusData);
      })
      .finally(() => setBudgetsLoading(false));

  useEffect(() => {
    loadBudgets().catch(() => toast.error("Unable to load budgets"));
  }, []);

  const trackedBudgets = useMemo(() => {
    const map = new Map();
    [...status.monthlyBudgets, ...status.categoryBudgets].forEach((item) => {
      map.set(item.budgetId, item);
    });
    return budgets.map((budget) => ({ ...budget, status: map.get(budget.id) }));
  }, [budgets, status]);

  const updateForm = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submitBudget = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      await createBudget(form);
      toast.success("Budget created");
      setForm((current) => ({ ...current, amount: "", category: "", name: "" }));
      setBudgetsLoading(true);
      await loadBudgets();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create budget");
    } finally {
      setSaving(false);
    }
  };

  const removeBudget = async (id) => {
    try {
      await deleteBudget(id);
      toast.success("Budget removed");
      setBudgetsLoading(true);
      await loadBudgets();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to remove budget");
    }
  };

  return (
    <section className="section-slide grid gap-5 xl:grid-cols-[380px_1fr]">
      <form className="h-fit rounded-lg border border-white/10 bg-white/[0.04] p-5" onSubmit={submitBudget}>
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-teal-400/15 text-teal-300">
            <CalendarDays size={20} />
          </span>
          <div>
            <h2 className="text-lg font-semibold">Create budget</h2>
            <p className="text-sm text-slate-400">Monthly or category specific</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm text-slate-300">Type</span>
            <select
              className="mt-2 w-full rounded-lg border border-white/10 bg-[#1e293b] px-3 py-3 outline-none"
              name="type"
              onChange={updateForm}
              value={form.type}
            >
              <option value="monthly">Monthly</option>
              <option value="category">Category</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm text-slate-300">Name</span>
            <input
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 py-3 outline-none"
              name="name"
              onChange={updateForm}
              placeholder="Food guardrail"
              required
              value={form.name}
            />
          </label>
          {form.type === "category" && (
            <label className="block">
              <span className="text-sm text-slate-300">Category</span>
              <input
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 py-3 outline-none"
                name="category"
                onChange={updateForm}
                placeholder="Food"
                required
                value={form.category}
              />
            </label>
          )}
          <label className="block">
            <span className="text-sm text-slate-300">Amount</span>
            <input
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 py-3 outline-none"
              min="1"
              name="amount"
              onChange={updateForm}
              placeholder="25000"
              required
              type="number"
              value={form.amount}
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-3 outline-none"
              max="12"
              min="1"
              name="month"
              onChange={updateForm}
              type="number"
              value={form.month}
            />
            <input
              className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-3 outline-none"
              min="2020"
              name="year"
              onChange={updateForm}
              type="number"
              value={form.year}
            />
          </div>
          <button
            className="premium-action inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={saving}
            type="submit"
          >
            {saving ? <CurrencyLoader compact /> : <Plus size={18} />}
            {saving ? "Saving" : "Add budget"}
          </button>
        </div>
      </form>

      <div className="grid content-start gap-4 md:grid-cols-2">
        {budgetsLoading ? (
          <div className="col-span-full grid min-h-[360px] place-items-center rounded-lg border border-white/10 bg-white/[0.04]">
            <CurrencyLoader message="Fetching budgets" />
          </div>
        ) : trackedBudgets.length === 0 ? (
          <div className="col-span-full grid min-h-[260px] place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-sm text-slate-400">
            No budgets yet.
          </div>
        ) : (
        trackedBudgets.map((budget) => {
          const used =
            budget.status?.percentageUsed ?? 0;
          const spent = budget.status?.spent ?? budget.status?.totalSpent ?? 0;

          return (
            <article key={budget.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-slate-500">{budget.type}</p>
                  <h3 className="mt-2 text-xl font-semibold">{budget.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {budget.category || "All categories"} / {budget.month}/{budget.year}
                  </p>
                </div>
                <button
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-slate-300 hover:bg-white/[0.06]"
                  onClick={() => removeBudget(budget.id)}
                  title="Delete budget"
                  type="button"
                >
                  <Trash2 size={17} />
                </button>
              </div>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="text-sm text-slate-400">Spent</p>
                  <p className="text-2xl font-semibold">{formatCurrency(spent)}</p>
                </div>
                <p className="text-sm text-slate-400">of {formatCurrency(budget.amount)}</p>
              </div>
              <div className="mt-4 h-3 rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full ${used > 100 ? "bg-rose-400" : used > 75 ? "bg-yellow-300" : "bg-teal-400"}`}
                  style={{ width: `${Math.min(used, 100)}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-slate-400">{used}% used</p>
            </article>
          );
        })
        )}
      </div>
    </section>
  );
}

export default BudgetSection;
