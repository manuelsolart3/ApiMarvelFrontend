import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const userId = localStorage.getItem("userId"); // Obtener el usuario desde el localStorage

  // Fetch para los comics y favoritos del usuario
  useEffect(() => {
    const fetchComics = async () => {
      try {
        const token = localStorage.getItem("token"); // Obtener el token del localStorage
        if (!token) {
          throw new Error("No token found, please login.");
        }

        const response = await fetch("https://localhost:7047/api/comic/all?Page=1&PageSize=10", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al cargar los cómics");
        }

        const result = await response.json();
        setComics(result.list); // Asegúrate de acceder a la propiedad `list`
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`https://localhost:7047/api/user/favorite-comics?userId=${userId}&page=1&pageSize=100`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los favoritos");
        }

        const result = await response.json();
        const favoriteSet = new Set(result.list.map((comic) => comic.id));
        setFavorites(favoriteSet);
      } catch (err) {
        console.error("Error al obtener favoritos", err.message);
      }
    };

    fetchComics();
    fetchFavorites();
  }, [userId]);

  // Maneja agregar o eliminar de favoritos
  const toggleFavorite = async (comicId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      if (favorites.has(comicId)) {
        // Si ya es favorito, eliminarlo
        await fetch(`https://localhost:7047/api/user/favorites/${comicId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        setFavorites((prev) => {
          const newFavorites = new Set(prev);
          newFavorites.delete(comicId);
          return newFavorites;
        });
      } else {
        // Si no es favorito, agregarlo
        await fetch("https://localhost:7047/api/user/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId,       // Enviar el userId desde el localStorage
            comicId,      // Enviar el comicId de la publicación
          }),
        });
        setFavorites((prev) => new Set(prev).add(comicId));
      }
    } catch (error) {
      console.error("Error al actualizar favoritos", error);
    }
  };

  if (loading) return <p>Cargando cómics...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Listado de Cómics</h1>
      <ul>
        {comics.map((comic) => (
          <li key={comic.id}>
            <h3>{comic.title}</h3>
            <img src={comic.imageUrl} alt={comic.title} width={150} />
            <button onClick={() => toggleFavorite(comic.id)}>
              {favorites.has(comic.id) ? "❤️" : "🤍"}
            </button>
            <Link to={`/comic/${comic.id}`}>Ver detalles</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
