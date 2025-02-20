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
import { Container, Row, Col, Card, Button, Navbar } from "react-bootstrap";
import { BiLogoCreativeCommons } from "react-icons/bi";

const HomePage = () => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const { logout } = UseAuth();
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    const fetchComics = async () => {
      try {
        setLoading(true);
        const result = await getAllComics(page, pageSize);
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
        const favoriteData = await getFavoriteComics();
        setFavorites(favoriteData.list);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchComics();
    fetchFavoriteComics();
  }, [page]);

  const handleAddToFavorites = async (comicId) => {
    try {
      await addFavoriteComic(comicId);
      setFavorites((prevFavorites) => [...prevFavorites, { comicId }]);
      setMessage("Cómic añadido a favoritos!");
    } catch (error) {
      setMessage("Error al añadir el cómic a favoritos.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isFavorite = (comicId) => {
    return favorites.some((favorite) => favorite.comicId === comicId);
  };

  if (loading) return <p>Cargando cómics...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="page-container">
      {/* Navbar */}
      <Navbar className="custom-navbar">
        <div className="navbar-container">
          <div className="navbar-brand-content">
            <div className="navbar-logo-container">
              <img
                src="https://img.freepik.com/vector-premium/pajaro-premium-logo-morado_97365-202.jpg?w=740"
                alt="Comics Logo"
                className="navbar-logo"
              />
            </div>
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
      <div className="banner">
        <img
          src="https://aiptcomics.com/ezoimgfmt/i0.wp.com/aiptcomics.com/wp-content/uploads/2025/01/april-2025-marvel-solicitations.jpg?ezimgfmt=ng%3Awebp%2Fngcb4%2Frs%3Adevice%2Frscb4-1&ssl=1&w=1200"
          alt="Comics Banner"
          className="banner-image"
        />
        <div className="banner-content">
          <h1 className="banner-title">Comics Universe</h1>
          <p className="banner-subtitle">
            Descubre mundos infinitos de historias
          </p>
          <BiLogoCreativeCommons />
        </div>
      </div>

      <Container fluid className="color-white p#e9dfeex-grow-1">
        <h1 className="color-lorem text-center main-title  margin-top: 10px;">
          Lorem
        </h1>

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
                      Añadido en favoritos
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Paginacion*/}
        <div className="pagination-container mt-4">
          <Button
            className="custom-button"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <span className="mx-3 color-negro">Página {page}</span>
          <Button
            className="custom-button"
            onClick={() => setPage(page + 1)}
            disabled={page * pageSize >= totalCount}
          >
            Siguiente
          </Button>
        </div>
        <h1 className="color-lorem text-center main-title  margin-top: 10px;"> lorem</h1>
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
