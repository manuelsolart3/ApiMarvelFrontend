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

  const register = async (fullName,identification, email ) => {
    const response = await fetch("https://localhost:7047/api/user", {
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
