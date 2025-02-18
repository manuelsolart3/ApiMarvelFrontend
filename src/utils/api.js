import { UseAuth } from "../context/AuthContext";

export const useApi = () => {
  const { token } = UseAuth();

  const fetchData = async (url, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }), // Agregar token si existe
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }

    return response.json();
  };

  return { fetchData };
};
