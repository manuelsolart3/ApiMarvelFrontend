import axios from "axios";
import { UseAuth } from "../context/AuthContext";

const API_BASE_URL = "https://localhost:7047/api";

const axiosInstance  = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


const refreshToken = async (token, setToken) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/refresh-token`, { token });
    const { newToken } = response.data;

    setToken(newToken); 

    return newToken;
  } catch (error) {
    console.error("Error al refrescar el token:", error);
    throw error;
  }
};


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

      return axios(originalRequest);
    }

    return Promise.reject(error);
  }
);


axiosInstance.interceptors.request.use((config) => {
  const { token } = UseAuth();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const useToken = () => {
  const { token } = UseAuth();
  return token;
};


axiosInstance.interceptors.request.use((config) => {
  const token = useToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


