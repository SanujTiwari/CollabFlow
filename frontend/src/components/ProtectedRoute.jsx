import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TextLoader from "./common/TextLoader";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <TextLoader fullScreen text="COLLABFLOW" variant="amber" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;