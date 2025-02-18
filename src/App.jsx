import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import FavoritePage from "./pages/FavoritePage";
import ComicDetailPage from "./pages/ComicDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute"
 
function App() {
  return (
    <Router>
      <AuthProvider>
      <Routes>
        {/* Rutas públicas (login, register) */}
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
