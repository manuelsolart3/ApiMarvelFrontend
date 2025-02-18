import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllComics } from "../services/comicService";
import { getFavoriteComics, addFavoriteComic } from "../services/favoriteService";

const HomePage = () => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]); // Para almacenar los cómics favoritos del usuario
  const [message, setMessage] = useState(null); // Para mostrar el mensaje de éxito

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const result = await getAllComics(); // Obtener los cómics
        setComics(result.list);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchFavoriteComics = async () => {
      try {
        const favoriteData = await getFavoriteComics(); // Obtener los favoritos del usuario
        setFavorites(favoriteData.list); // Guardar los cómics favoritos
      } catch (err) {
        setError(err.message);
      }
    };

    fetchComics();
    fetchFavoriteComics();
  }, []);

  const handleAddToFavorites = async (comicId) => {
    try {
      await addFavoriteComic(comicId); // Añadir el cómic a favoritos
      setFavorites((prevFavorites) => [...prevFavorites, { comicId }]); // Actualizar el estado de favoritos
      setMessage("Cómic añadido a favoritos!"); // Mostrar mensaje
    } catch (error) {
      setMessage("Error al añadir el cómic a favoritos.");
    }
  };

  const isFavorite = (comicId) => {
    return favorites.some((favorite) => favorite.comicId === comicId); // Verificar si el cómic ya está en favoritos
  };

  if (loading) return <p>Cargando cómics...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Listado de Cómics</h1>
      {message && <p>{message}</p>} {/* Mostrar mensaje si existe */}

      <ul>
        {comics.map((comic) => (
          <li key={comic.id}>
            <h3>{comic.title}</h3>
            <img src={comic.imageUrl} alt={comic.title} width={150} />
            <Link to={`/comic/${comic.id}`}>Ver detalles</Link>

            {/* Cambiar el texto del botón dependiendo de si el cómic ya está en favoritos */}
            {!isFavorite(comic.id) ? (
              <button onClick={() => handleAddToFavorites(comic.id)}>Añadir a favoritos</button>
            ) : (
              <button disabled>Ya en Favoritos</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
