import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllComics } from "../services/comicService";
import { getFavoriteComics, addFavoriteComic } from "../services/favoriteService";
import { useNavigate } from "react-router-dom";
import { UseAuth } from "../context/AuthContext"; 

const HomePage = () => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]); // Para almacenar los cómics favoritos del usuario
  const [message, setMessage] = useState(null); // Para mostrar el mensaje de éxito
  const navigate = useNavigate();
  const { logout } = UseAuth();
  const [page, setPage] = useState(1); // Estado para la paginación
  const [totalCount, setTotalCount] = useState(0); // Cantidad total de cómics
  const pageSize = 10; // Número de cómics por página

  useEffect(() => {
    const fetchComics = async () => {
      try {
        setLoading(true);
        const result = await getAllComics(page, pageSize); // Obtener los cómics
        setComics(result.list);
        setTotalCount(result.count);
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
  }, [page]);

  const handleAddToFavorites = async (comicId) => {
    try {
      await addFavoriteComic(comicId); // Añadir el cómic a favoritos
      setFavorites((prevFavorites) => [...prevFavorites, { comicId }]); // Actualizar el estado de favoritos
      setMessage("Cómic añadido a favoritos!"); // Mostrar mensaje
    } catch (error) {
      setMessage("Error al añadir el cómic a favoritos.");
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirige al login después de cerrar sesión
  };

  const isFavorite = (comicId) => {
    return favorites.some((favorite) => favorite.comicId === comicId); // Verificar si el cómic ya está en favoritos
  };

  if (loading) return <p>Cargando cómics...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <h1>Listado de Cómics</h1>
      {message && <p>{message}</p>} {/* Mostrar mensaje si existe */}

      {/* Botón para ir a Favoritos */}
      <button onClick={() => navigate("/favorite")} style={{ marginBottom: "10px" }}>
        Ver Mis Favoritos
      </button>

      <ul style={{ flex: 1, overflowY: "auto" }}>
        {comics.map((comic) => (
          <li key={comic.id} style={{ marginBottom: "15px" }}>
            <h3>{comic.title}</h3>
            <img src={comic.imageUrl} alt={comic.title} width={150} />
            <Link to={`/comic/${comic.id}`}>Ver detalles</Link>

            {!isFavorite(comic.id) ? (
              <button onClick={() => handleAddToFavorites(comic.id)}>Añadir a favoritos</button>
            ) : (
              <button disabled>Ya en Favoritos</button>
            )}
          </li>
        ))}
      </ul>

      {/* Botón de Cerrar Sesión al final */}
      <button 
        onClick={handleLogout} 
        style={{
          marginTop: "auto",
          backgroundColor: "red",
          color: "white",
          padding: "10px 15px",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px"
        }}
      >
        Cerrar Sesión
      </button>
      <div style={{ marginTop: "20px" }}>
            <button 
              onClick={() => setPage(page - 1)} 
              disabled={page === 1}
            >
              Anterior
            </button>
            <span style={{ margin: "0 10px" }}>Página {page}</span>
            <button 
              onClick={() => setPage(page + 1)} 
              disabled={page * pageSize >= totalCount}
            >
              Siguiente
            </button>
          </div>
    </div>
  );
}

export default HomePage;
