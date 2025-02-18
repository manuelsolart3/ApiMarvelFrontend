import { UseAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom"; // Usamos Navigate para redirigir

const ProtectedRoute = ({ children }) => {
  const { token } = UseAuth();


  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children; 
};

export default ProtectedRoute;
