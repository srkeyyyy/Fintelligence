import AIInsightsCard from "./AIInsightsCard";
import ExpenseChart from "./ExpenseChart";
import SummaryCards from "./SummaryCards";

import ChatWindow from "../chat/ChatWindow";

function Dashboard() {
  return (
    <div className="space-y-6">
      <SummaryCards />

      <ExpenseChart />

      <AIInsightsCard />

      <ChatWindow />
    </div>
  );
}

export default Dashboard;