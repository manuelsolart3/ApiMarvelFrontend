const API_URL = "https://localhost:7047/api/comic";
const getAllComics = async (page = 1, pageSize = 10) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found, please login.");
  }

  const response = await fetch(`${API_URL}/all?Page=${page}&PageSize=${pageSize}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al cargar los cómics");
  }

  return await response.json();
};

// Obtener detalles de un cómic por ID
export const getComicDetails = async (comicId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found, please login.");

  const response = await fetch(`${API_URL}/${comicId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) throw new Error("Cómic no encontrado");
  return response.json();
};

export { getAllComics };
