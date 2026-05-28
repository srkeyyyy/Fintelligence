import { useEffect, useMemo, useState } from "react";
import { Bot, IndianRupee, Send, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import toast from "react-hot-toast";
import { chatWithAI, getAIInsights } from "../../services/ai.service";
import {
  getBudgetStatus,
  getCategoryBreakdown,
  getRecentTransactions,
  getSummary,
  getTimeline,
} from "../../services/analytics.service";
import ChatTypingLoader from "../common/ChatTypingLoader";
import CurrencyLoader from "../common/CurrencyLoader";

const COLORS = ["#34d399", "#38bdf8", "#f59e0b", "#f472b6", "#a78bfa", "#fb7185"];

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);

function DashboardSection() {
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [recent, setRecent] = useState([]);
  const [budgetStatus, setBudgetStatus] = useState({ categoryBudgets: [], monthlyBudgets: [] });
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi, I am MonAI. Ask me what changed in your spending, where pressure is building, or what to do next.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      getSummary(),
      getCategoryBreakdown(),
      getTimeline(),
      getRecentTransactions(),
      getBudgetStatus(),
    ])
      .then(([summaryData, categoryData, timelineData, recentData, budgetData]) => {
        setSummary(summaryData);
        setCategories(categoryData);
        setTimeline(timelineData);
        setRecent(recentData);
        setBudgetStatus(budgetData);
      })
      .catch(() => toast.error("Unable to load dashboard data"))
      .finally(() => setDashboardLoading(false));
  }, []);

  const budgetWarnings = useMemo(
    () => [
      ...budgetStatus.monthlyBudgets,
      ...budgetStatus.categoryBudgets,
    ].filter((budget) => budget.percentageUsed >= 75),
    [budgetStatus]
  );

  const askAssistant = async (event) => {
    event.preventDefault();

    if (!chatInput.trim()) {
      return;
    }

    const question = chatInput.trim();
    setMessages((current) => [...current, { role: "user", text: question }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const data = await chatWithAI(question);
      setMessages((current) => [...current, { role: "assistant", text: data.response }]);
    } catch (error) {
      toast.error(error.response?.data?.message || "MonAI is unavailable");
    } finally {
      setChatLoading(false);
    }
  };

  const generateInsight = async () => {
    setChatLoading(true);

    try {
      const data = await getAIInsights();
      setMessages((current) => [...current, { role: "assistant", text: data.insights }]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to generate insights");
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <section className="section-slide space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryTile icon={TrendingUp} label="Income" loading={dashboardLoading} tone="teal" value={formatCurrency(summary.income)} />
        <SummaryTile icon={TrendingDown} label="Expenses" loading={dashboardLoading} tone="rose" value={formatCurrency(summary.expense)} />
        <SummaryTile icon={Wallet} label="Balance" loading={dashboardLoading} tone="sky" value={formatCurrency(summary.balance)} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Spending timeline</h2>
              <span className="text-sm text-slate-400">{dashboardLoading ? "" : `${timeline.length} points`}</span>
            </div>
            <div className="h-72">
              {dashboardLoading ? (
                <div className="grid h-full place-items-center">
                  <CurrencyLoader compact message="Fetching spending timeline" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeline}>
                    <defs>
                      <linearGradient id="expenseFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                    <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <Tooltip content={<MoneyTooltip />} />
                    <Area dataKey="total" fill="url(#expenseFill)" stroke="#34d399" strokeWidth={2} type="monotone" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
              <h2 className="mb-4 text-lg font-semibold">Category wise spending</h2>
              <div className="h-64">
                {dashboardLoading ? (
                  <div className="grid h-full place-items-center">
                    <CurrencyLoader compact message="Fetching category data" />
                  </div>
                ) : categories.length === 0 ? (
                  <div className="grid h-full place-items-center text-sm text-slate-400">No category spending yet.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categories}
                        dataKey="total"
                        innerRadius={58}
                        label={({ category }) => category}
                        labelLine={false}
                        onMouseEnter={(entry) => setActiveCategory(entry.category)}
                        onMouseLeave={() => setActiveCategory(null)}
                        outerRadius={92}
                        paddingAngle={4}
                      >
                        {categories.map((entry, index) => (
                          <Cell
                            key={entry.category}
                            fill={COLORS[index % COLORS.length]}
                            opacity={!activeCategory || activeCategory === entry.category ? 1 : 0.35}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CategoryTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="mt-4 grid gap-2">
                {categories.map((entry, index) => (
                  <button
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                      activeCategory === entry.category ? "bg-white/[0.1]" : "bg-white/[0.04] hover:bg-white/[0.07]"
                    }`}
                    key={entry.category}
                    onMouseEnter={() => setActiveCategory(entry.category)}
                    onMouseLeave={() => setActiveCategory(null)}
                    type="button"
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[index % COLORS.length] }} />
                      {entry.category}
                    </span>
                    <span className="text-slate-300">{formatCurrency(entry.total)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
              <h2 className="mb-4 text-lg font-semibold">Budget warnings</h2>
              <div className="space-y-3">
                {budgetWarnings.length === 0 ? (
                  <p className="text-sm text-slate-400">No budget pressure detected yet.</p>
                ) : (
                  budgetWarnings.slice(0, 5).map((budget) => (
                    <div key={budget.budgetId} className="rounded-lg bg-white/[0.04] p-3">
                      <div className="flex justify-between text-sm">
                        <span>{budget.name}</span>
                        <span>{budget.percentageUsed}%</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-amber-300"
                          style={{ width: `${Math.min(budget.percentageUsed, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <aside className="flex min-h-[640px] flex-col rounded-lg border border-white/10 bg-[#141a20]">
          <div className="flex items-center justify-between border-b border-white/10 p-4">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-teal-400/15 text-teal-300">
                <Bot size={19} />
              </span>
              <div>
                <h2 className="font-semibold">MonAI</h2>
                <p className="text-xs text-slate-400">Your money assistant</p>
              </div>
            </div>
            <button
              className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-200 hover:bg-white/[0.06]"
              onClick={generateInsight}
              type="button"
            >
              Insight
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                className={`max-w-[92%] rounded-lg px-4 py-3 text-sm leading-6 ${
                  message.role === "user"
                    ? "ml-auto bg-teal-400 text-slate-950"
                    : "bg-white/[0.06] text-slate-100"
                }`}
                key={`${message.role}-${index}`}
              >
                {message.role === "assistant" ? <FormattedAssistantText text={message.text} /> : message.text}
              </div>
            ))}
            {chatLoading && <ChatTypingLoader />}
          </div>

          <form className="flex gap-2 border-t border-white/10 p-4" onSubmit={askAssistant}>
            <input
              className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-3 text-sm outline-none focus:border-teal-300/60"
              onChange={(event) => setChatInput(event.target.value)}
              placeholder="Ask about your spending"
              value={chatInput}
            />
            <button className="premium-action grid h-12 w-12 place-items-center rounded-lg text-slate-950" type="submit">
              <Send size={18} />
            </button>
          </form>
        </aside>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
        <h2 className="mb-4 text-lg font-semibold">Recent transactions</h2>
        <div className="grid gap-3">
          {recent.map((transaction) => (
            <div key={transaction.id} className="grid gap-2 rounded-lg bg-white/[0.04] p-3 sm:grid-cols-[1fr_auto]">
              <div>
                <p className="font-medium">{transaction.merchant || transaction.description || transaction.category}</p>
                <p className="text-sm text-slate-400">{transaction.category}</p>
              </div>
              <p className={transaction.type === "income" ? "text-teal-300" : "text-rose-300"}>
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SummaryTile({ icon: Icon, label, loading, tone, value }) {
  const tones = {
    teal: "text-teal-300 bg-teal-400/12",
    rose: "text-rose-300 bg-rose-400/12",
    sky: "text-sky-300 bg-sky-400/12",
  };

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">{label}</span>
        <span className={`grid h-10 w-10 place-items-center rounded-lg ${tones[tone]}`}>
          <Icon size={20} />
        </span>
      </div>
      {loading ? (
        <div className="mt-3 flex justify-start">
          <CurrencyLoader compact />
        </div>
      ) : (
        <p className="mt-4 flex items-center text-3xl font-semibold">
          <IndianRupee size={0} />
          {value}
        </p>
      )}
    </div>
  );
}

function CategoryTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0].payload;

  return (
    <div className="rounded-lg border border-white/10 bg-[#1e293b] px-3 py-2 text-sm shadow-xl">
      <p className="font-semibold text-white">{item.category}</p>
      <p className="text-slate-300">{formatCurrency(item.total)}</p>
    </div>
  );
}

function MoneyTooltip({ active, label, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border border-white/10 bg-[#1e293b] px-3 py-2 text-sm shadow-xl">
      <p className="font-semibold text-white">{label}</p>
      <p className="text-slate-300">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

function FormattedAssistantText({ text }) {
  const lines = text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="space-y-2">
      {lines.map((line, index) => {
        const isBullet = /^[-*•]\s+/.test(line);
        const cleanLine = line.replace(/^[-*•]\s+/, "");

        return (
          <p className={isBullet ? "pl-3 before:mr-2 before:content-['•']" : ""} key={`${line}-${index}`}>
            {cleanLine}
          </p>
        );
      })}
    </div>
  );
}

export default DashboardSection;
