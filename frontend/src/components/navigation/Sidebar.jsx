import { BarChart3, CreditCard, LayoutDashboard } from "lucide-react";

const sections = [
  { icon: LayoutDashboard, id: "dashboard", label: "Dashboard" },
  { icon: BarChart3, id: "budgets", label: "Budgets" },
  { icon: CreditCard, id: "transactions", label: "Transactions" },
];

function Sidebar({ activeSection, setActiveSection }) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-[#172033] p-5 lg:block">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-teal-300">Fintelligence</h1>
      </div>

      <nav className="space-y-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const selected = activeSection === section.id;

          return (
            <button
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
                selected ? "bg-teal-400 text-slate-950 shadow-lg shadow-teal-400/20" : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
              }`}
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              type="button"
            >
              <Icon size={19} />
              {section.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
