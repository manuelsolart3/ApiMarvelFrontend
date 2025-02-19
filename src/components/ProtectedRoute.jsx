import { UseAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom"; 

const ProtectedRoute = ({ children }) => {
  const { token } = UseAuth();


  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children; 
};

export default ProtectedRoute;
