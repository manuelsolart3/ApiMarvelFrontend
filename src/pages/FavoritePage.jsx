// FavoritePage.js
import { useEffect, useState } from "react";
import { getFavoriteComics, deleteFavoriteComic } from "../services/favoriteService"; // Asegúrate de que la ruta es correcta
import { Link } from "react-router-dom";

const FavoritePage = () => {
  const [favoriteComics, setFavoriteComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavoriteComics = async () => {
      try {
        // Llamamos al servicio para obtener los cómics favoritos
        const data = await getFavoriteComics(1, 10); // Llamada con página 1 y tamaño 10
        setFavoriteComics(data.list);  // Actualizamos el estado con la lista de favoritos
      } catch (err) {
        setError(err.message);  // Si hay un error, lo guardamos en el estado
      } finally {
        setLoading(false);  // Cuando la petición termine (ya sea exitosa o con error), dejamos de cargar
      }
    };

    fetchFavoriteComics();
  }, []);  // La dependencia vacía [] significa que esto solo se ejecutará una vez al cargar la página

  const handleDeleteFavorite = async (favoriteId) => {
    try {
      const success = await deleteFavoriteComic(favoriteId);
      if (success) {
        // Actualizamos la lista de comics eliminando el favorito
        setFavoriteComics(favoriteComics.filter((comic) => comic.favoriteId !== favoriteId));
        alert("Cómic eliminado de favoritos");
      } else {
        alert("Hubo un problema al eliminar el cómic.");
      }
    } catch (err) {
      setError(err.message);
      alert("Error al eliminar el cómic.");
    }
  };
  

  if (loading) return <p>Cargando favoritos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Cómics Favoritos</h1>
      {favoriteComics.length === 0 ? (
        <p>No tienes cómics favoritos aún.</p>
      ) : (
        <ul>
          {favoriteComics.map((comic) => (
            <li key={comic.favoriteId}>
              <h3>{comic.title}</h3>
              <img src={comic.imageUrl} alt={comic.title} width={150} />
              <Link to={`/comic/${comic.comicId}`}>Ver detalles</Link>
              <button onClick={() => handleDeleteFavorite(comic.favoriteId)}>Eliminar de favoritos</button>
            </li>
          ))}
        </ul>
      )}
      <Link to="/home">Volver al inicio</Link>  {/* Botón para regresar al Home */}
    </div>
  );
};

export default FavoritePage;
