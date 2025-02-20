import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
const API_USER_URL  = import.meta.env.VITE_API_BASE_URL;
export const API_URL = `${API_USER_URL}/api/user`;

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

  const login = async (email, identification) => {
    const response = await fetch(`${API_URL}/login`, {
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

  const register = async (fullName,identification, email ) => {
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" , "Accept": "application/json" },
      body: JSON.stringify({FullName : fullName ,Identification :identification,Email: email}),
    });
    if (!response.ok) {
      throw new Error("Error en el registro");
    }

    setUser({ fullName, identification, email });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
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
