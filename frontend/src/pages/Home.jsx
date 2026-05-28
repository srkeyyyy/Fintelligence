import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { LogOut } from "lucide-react";

import Sidebar from "../components/navigation/Sidebar";

import Dashboard from "../components/dashboard/DashboardSection";
import BudgetSection from "../components/budgets/BudgetSection";
import TransactionSection from "../components/transactions/TransactionSection";
import { useAuth } from "../context/AuthContext";

const sections = [
  { id: "budgets", label: "Budgets" },
  { id: "dashboard", label: "Dashboard" },
  { id: "transactions", label: "Transactions" },
];

function Home() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const { logout, user } = useAuth();

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;

      case "budgets":
        return <BudgetSection />;

      case "transactions":
        return <TransactionSection />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white">
      <Toaster position="top-center" />
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0f172a]/90 px-5 py-4 backdrop-blur md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Welcome{user?.name ? `, ${user.name}` : ""}</p>
              <h1 className="text-2xl font-semibold capitalize">{activeSection}</h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="grid grid-cols-3 rounded-lg border border-white/10 bg-white/[0.04] p-1">
                {sections.map((section) => (
                  <button
                    className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                      activeSection === section.id ? "bg-teal-400 text-slate-950 shadow-lg shadow-teal-400/20" : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                    }`}
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    type="button"
                  >
                    {section.label}
                  </button>
                ))}
              </div>
              <button
                className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-slate-300 hover:bg-white/[0.06]"
                onClick={logout}
                title="Logout"
                type="button"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        <div className="p-5 md:p-6">{renderSection()}</div>
      </main>
    </div>
  );
}

export default Home;
