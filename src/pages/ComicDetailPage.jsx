import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getComicDetails } from "../services/comicService";
import { UseAuth } from "../context/AuthContext";
import { Container, Row, Col, Button,
  Navbar, } from 'react-bootstrap';
import "../styles/generalStyles.css";
import { BsArrowLeft } from "react-icons/bs"; 


const ComicDetailPage = () => {
  const { id } = useParams();
  console.log(id);
  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = UseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComicDetails = async () => {
      try {
        const result = await getComicDetails(id);
        setComic(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComicDetails();
  }, [id]);

  const handleLogout = () => {
    logout();
    navigate("/login"); 
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="text-center mt-5">
      <h3 className="text-danger">Error: {error}</h3>
      <Link to="/home" className="btn custom-button mt-3">Volver al inicio</Link>
    </div>
  );
  
  if (!comic) return (
    <div className="text-center mt-5">
      <h3>No se encontró el cómic</h3>
      <Link to="/home" className="btn custom-button mt-3">Volver al inicio</Link>
    </div>
  );
  
  return (
    <>
      <Navbar className="custom-navbar">
        <div className="navbar-container">
          <div className="navbar-brand-content">
          <Button variant="link" onClick={() => navigate("/home")} style={{ color: "white", textDecoration: "none" }}>
            <BsArrowLeft size={24} />
          </Button>
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

      <Container className="py-5">
        <div className="comic-card p-4" style={{ maxWidth: "1000px", margin: "auto" }}>
          <Row className="g-4">
            <Col md={5}>
              <img 
                src={comic.imageUrl} 
                alt={comic.title} 
                className="img-fluid rounded"
                style={{ 
                  width: "100%",
                  height: "400px",
                  objectFit: "cover"
                }}
              />
            </Col>
            <Col md={7}>
              <h1 className="color-negro mb-4">{comic.title}</h1>
              
              <div className="mb-3">
                <p className="mb-2">
                  <span className="fw-bold color-secondary">Autor: </span>
                  <span className="color-negro">{comic.author}</span>
                </p>
                <p className="mb-2">
                  <span className="fw-bold color-secondary">Referencia: </span>
                  <span className="color-negro">{comic.reference}</span>
                </p>
                <p className="mb-2">
                  <span className="fw-bold color-secondary">Páginas: </span>
                  <span className="color-negro">{comic.pages}</span>
                </p>
              </div>

              <p className="color-negro mb-4">{comic.description}</p>

              <Link 
                to="/home" 
                className="btn custom-button">
                Volver al inicio
              </Link>
            </Col>
          </Row>
        </div>
      </Container>
    </>
);
};

export default ComicDetailPage;
