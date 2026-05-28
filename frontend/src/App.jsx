import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import BudgetSetup from "./pages/BudgetSetup";
import Home from "./pages/Home";

import ProtectedRoute from "./routes/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/auth" element={<Auth />} />

        <Route
          path="/budget-setup"
          element={
            <ProtectedRoute>
              <BudgetSetup />
            </ProtectedRoute>
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
