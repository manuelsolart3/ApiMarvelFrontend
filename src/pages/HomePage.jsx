import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllComics } from "../services/comicService";
import {
  getFavoriteComics,
  addFavoriteComic,
} from "../services/favoriteService";
import { useNavigate } from "react-router-dom";
import { UseAuth } from "../context/AuthContext";
import "../styles/Register.css";
import "../styles/colors.css";
import "../styles/generalStyles.css";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Navbar,
  Nav,
} from "react-bootstrap";

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
    <div className="page-container">
      {/* Navbar */}
      <Navbar className="custom-navbar">
        <div className="navbar-container">
          <div className="navbar-brand-content">
            <img
              src="https://img.freepik.com/vector-gratis/ilustracion-vector-burbuja-explosion-comic-snarl_1142-7415.jpg"
              alt="Comics Logo"
              className="navbar-logo"
            />
            <h1 className="navbar-brand-text">Comics Universe</h1>
          </div>
          <div className="navbar-actions">
          <div className="navbar-buttons">
            <Button
              className="btn-favorite"
              onClick={() => navigate("/favorite")}
            >
              Ver Mis Favoritos
            </Button>
            <Button className="custom-button" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </Navbar>

      {/* Banner */}
      {/* Banner */}
      <div className="banner">
        <img
          src="https://clarovideocdn6.clarovideo.net/PELICULAS/AVENGERSENDGAME/EXPORTACION_WEB/PT/AVENGERSENDGAMEWHORIZONTAL.jpg"
          alt="Comics Banner"
          className="banner-image"
        />
        <div className="banner-content">
          <h1 className="banner-title">Comics Universe</h1>
          <p className="banner-subtitle">
            Descubre mundos infinitos de historias
          </p>
        </div>
      </div>

      <Container fluid className="color-white p#e9dfeex-grow-1">
        <h1 className="color-white text-center main-title  margin-top: 10px;">aass</h1>

        <Row className="justify-content-center g-4">
          {comics.map((comic) => (
            <Col xs={12} sm={6} md={4} lg={3} key={comic.id}>
              <Card className="comic-card">
                <Link
                  to={`/comic/${comic.id}`}
                  className="text-decoration-none"
                >
                  <Card.Img src={comic.imageUrl} alt={comic.title} />
                </Link>
                <Card.Body>
                  <Link
                    to={`/comic/${comic.id}`}
                    className="text-decoration-none"
                  >
                    <h5 className="card-title">{comic.title}</h5>
                  </Link>
                  {!isFavorite(comic.id) ? (
                    <Button
                      className="custom-button w-100"
                      onClick={() => handleAddToFavorites(comic.id)}
                    >
                      Añadir a Favoritos
                    </Button>
                  ) : (
                    <Button className="btn-in-favorites w-100" disabled>
                      Ya en Favoritos
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Pagination */}
        <div className="pagination-container mt-4">
          <Button
            className="custom-button"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <span className="mx-3">Página {page}</span>
          <Button
            className="custom-button"
            onClick={() => setPage(page + 1)}
            disabled={page * pageSize >= totalCount}
          >
            Siguiente
          </Button>
        </div>
      </Container>

      {/* Footer */}
      <footer className="custom-footer">
        <Container>
          <Row className="gy-4">
            <Col md={4}>
              <h5 className="footer-title">Contacto</h5>
              <p className="mb-1">📧 info@comics.com</p>
              <p className="mb-1">📞 +34 900 123 456</p>
            </Col>
            <Col md={4}>
              <h5 className="footer-title">Redes Sociales</h5>
              <p className="mb-1">📱 Instagram: @comicsuniverse</p>
              <p className="mb-1">🐦 Twitter: @comics_universe</p>
            </Col>
            <Col md={4}>
              <h5 className="footer-title">Enlaces</h5>
              <p className="mb-1">Términos y Condiciones</p>
              <p className="mb-1">Política de Privacidad</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default HomePage;
