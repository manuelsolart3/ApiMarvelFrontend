import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Función para iniciar sesión
  const login = async (email, identification) => {
    const response = await fetch("https://localhost:7047/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, identification }),
    });

    if (!response.ok) {
      throw new Error("Error en el login");
    }

    const data = await response.json();
    setToken(data.token);
    setUser(data.user);
  };

  // Función para registrar usuario
  const register = async (name, email, identification) => {
    const response = await fetch("https://localhost:7047/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, identification }),
    });

    if (!response.ok) {
      throw new Error("Error en el registro");
    }

    const data = await response.json();
    setUser(data);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token"); // Eliminar el token del localStorage
  };
  

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const UseAuth = () => useContext(AuthContext);
