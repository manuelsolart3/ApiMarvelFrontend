import { useEffect, useState,useCallback, lazy, Suspense  } from "react";
import { Link, useNavigate  } from "react-router-dom";
import { getAllComics } from "../services/comicService";
import {getFavoriteComics,addFavoriteComic,
} from "../services/favoriteService";
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
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const { logout } = UseAuth();
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
      
      // Auto-clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage("Error al añadir el cómic a favoritos.");
      setTimeout(() => setMessage(null), 3000);
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
                src="/logoPajaro.jpg"
                alt="Comics Logo"
                className="navbar-logo"
                width="60"
                height="60"
                loading="eager"
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
        <picture>
          {/* Provide WebP and fallback formats */}
          <source srcSet="/logo2.webp" type="image/webp" />
          <source srcSet="/logo2.jpg" type="image/jpeg" />
          <img
            src="/logo2.webp"
            alt="Comics Banner"
            className="banner-image"
            width="800"  
            height="400"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            style={{
              willChange: "auto",
              contentVisibility: "auto",
              contain: "layout paint"
            }}
            onLoad={(e) => {
              e.target.style.opacity = 1;
              // Remove the onLoad handler after it runs once
              e.target.onload = null;
            }}
          />
        </picture>
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
              <Card className="comic-card h-100">
                <Link
                  to={`/comic/${comic.id}`}
                  className="text-decoration-none"
                >
                    <div className="card-img-container">
                    <img 
                      src={comic.imageUrl} 
                      alt={comic.title}
                      className="card-img-top"
                      loading="lazy"
                      width="300"
                      height="450"
                    />
                  </div>

                </Link>
                <Card.Body className="d-flex flex-column">
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
        <nav className="pagination-container mt-4" aria-label="Navegación de páginas">
          <Button
            className="custom-button"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            aria-label="Página anterior"
          >
             Anterior
          </Button>
          <span className="mx-3 color-negro">Página {page}</span>
          <Button
            className="custom-button"
            onClick={() => setPage(page + 1)}
            disabled={page * pageSize >= totalCount}
            aria-label="Página siguiente"
          >
               Siguiente
          </Button>
        </nav>
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
