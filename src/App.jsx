import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import FavoritePage from "./pages/FavoritePage";
import ComicDetailPage from "./pages/ComicDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute"
 
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Lógica para verificar si el usuario está autenticado
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // Verifica si hay un token
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Si el usuario está autenticado, redirige al home */}
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />}
          />
          
          {/* Rutas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rutas protegidas */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorite"
            element={
              <ProtectedRoute>
                <FavoritePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/comic/:id"
            element={
              <ProtectedRoute>
                <ComicDetailPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
