// favoriteService.js
const API_URL = "https://localhost:7047/api/user";

//Get
const getFavoriteComics = async (page = 1, pageSize = 10) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    throw new Error("No token found, please login.");
  }

  const response = await fetch(`${API_URL}/favorite-comics?page=${page}&pageSize=${pageSize}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch favorite comics.");
  }

  const data = await response.json();

  return data;  // Retorna la lista de favoritos
};


//Add
const addFavoriteComic = async (comicId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found, please login.");
  }

  const response = await fetch(`${API_URL}/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ comicId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.name || "Failed to add favorite comic.");
  }

  return data;
};

//Delete
const deleteFavoriteComic = async (favoriteId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found, please login.");
  }

  const response = await fetch(`${API_URL}/favorites/${favoriteId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to remove favorite comic.");
  }

  return response.status === 200;
};


export { getFavoriteComics, addFavoriteComic,deleteFavoriteComic };
