import axios from "axios";
import { UseAuth } from "../context/AuthContext";

// URL base de la API
const API_BASE_URL = "https://localhost:7047/api";

// Instancia de Axios con configuración base
const axiosInstance  = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Función para refrescar el token
const refreshToken = async (token, setToken) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/refresh-token`, { token });
    const { newToken } = response.data;

    setToken(newToken); // Guardamos el nuevo token en el contexto

    return newToken;
  } catch (error) {
    console.error("Error al refrescar el token:", error);
    throw error;
  }
};


// Agregar un interceptor para manejar el token expirado
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const { token, setToken } = UseAuth();

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshToken(token, setToken);
      originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

      return axios(originalRequest); // Reintentar la solicitud original
    }

    return Promise.reject(error);
  }
);

// Interceptor para agregar el token en los encabezados
axiosInstance.interceptors.request.use((config) => {
  const { token } = UseAuth(); // Obtener el token desde el contexto
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Hook para acceder al token desde el contexto
const useToken = () => {
  const { token } = UseAuth();
  return token;
};


// Agregar el token en los encabezados de todas las solicitudes
axiosInstance.interceptors.request.use((config) => {
  const token = useToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`; // Agregamos el token al encabezado
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


// Función para obtener todos los cómics (paginados)
export const getComics = async (page = 1, pageSize = 10) => {
  try {
    const response = await axiosInstance.get(`/comic/all`, {
      params: { Page: page, PageSize: pageSize },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener cómics:", error);
    return null;
  }
};

// Función para obtener un cómic por ID
export const getComicById = async (id) => {
  try {
    const response = await axiosInstance.get(`/comic/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el cómic:", error);
    return null;
  }
};
