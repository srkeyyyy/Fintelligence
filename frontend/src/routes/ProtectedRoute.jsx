import { Navigate } from "react-router-dom";
import LoadingScreen from "../components/common/LoadingScreen";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { booting, isAuthenticated } = useAuth();

  if (booting) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  return children;
}

export default ProtectedRoute;
