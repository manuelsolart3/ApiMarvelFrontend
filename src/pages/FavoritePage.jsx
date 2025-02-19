import { useEffect, useState } from "react";
import { getFavoriteComics, deleteFavoriteComic } from "../services/favoriteService";
import { getComicDetails } from "../services/comicService";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Navbar, Button, Card, Modal } from "react-bootstrap";
import { UseAuth } from "../context/AuthContext";
import { BsArrowLeft } from "react-icons/bs";

const FavoritePage = () => {
  const navigate = useNavigate();
  const { logout } = UseAuth();

  // Estados para favoritos, loading y error
  const [favoriteComics, setFavoriteComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para la paginación
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [totalCount, setTotalCount] = useState(0);

  // Estados para el modal de confirmación
  const [showModal, setShowModal] = useState(false);
  const [comicToDelete, setComicToDelete] = useState(null);

  useEffect(() => {
    const fetchFavoriteComics = async () => {
      setLoading(true);
      try {
        const favoritesData = await getFavoriteComics(page, pageSize);
        setTotalCount(favoritesData.totalCount);
        
        const results = await Promise.allSettled(
          favoritesData.list.map(async (favorite) => {
            try {
              const comicDetails = await getComicDetails(favorite.comicId);
              return { favoriteId: favorite.favoriteId, ...comicDetails };
            } catch (error) {
              console.error(`Error fetching details for comicId ${favorite.comicId}:`, error);
              return null;
            }
          })
        );
        const validFavorites = results
          .filter((result) => result.status === "fulfilled" && result.value !== null)
          .map((result) => result.value);

        setFavoriteComics(validFavorites);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteComics();
  }, [page]);

  // Función para abrir el modal de confirmación
  const openDeleteModal = (comic) => {
    setComicToDelete(comic);
    setShowModal(true);
  };

  // Función para confirmar eliminación
  const confirmDelete = () => {
    if (comicToDelete) {
      handleDeleteFavorite(comicToDelete.favoriteId);
    }
    setShowModal(false);
    setComicToDelete(null);
  };

  // Cancelar la eliminación
  const cancelDelete = () => {
    setShowModal(false);
    setComicToDelete(null);
  };

  // Función para eliminar favorito
  const handleDeleteFavorite = async (favoriteId) => {
    try {
      const success = await deleteFavoriteComic(favoriteId);
      if (success) {
        setFavoriteComics(favoriteComics.filter((comic) => comic.favoriteId !== favoriteId));
      } else {
        alert("Hubo un problema al eliminar el cómic.");
      }
    } catch (err) {
      setError(err.message);
      alert("Error al eliminar el cómic.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Navbar de botón volver
  const renderNavbar = () => (
    <Navbar className="custom-navbar">
      <div
        className="navbar-container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 2rem",
        }}
      >
        <div
          className="navbar-brand-content"
          style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
        >
          <Button
            variant="link"
            onClick={() => navigate("/home")}
            style={{ color: "white", textDecoration: "none" }}
          >
            <BsArrowLeft size={24} />
          </Button>
          <img
            src="https://img.freepik.com/vector-gratis/ilustracion-vector-burbuja-explosion-comic-snarl_1142-7415.jpg"
            alt="Comics Logo"
            className="navbar-logo"
            style={{ width: "40px", height: "40px", borderRadius: "8px" }}
          />
          <h1
            className="navbar-brand-text"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "1.55rem",
              fontWeight: "bold",
              color: "white",
              margin: 0,
            }}
          >
            Comics Universe
          </h1>
        </div>
        <div className="navbar-actions" style={{ display: "flex", alignItems: "center" }}>
          <div className="navbar-buttons" style={{ display: "flex", gap: "10px" }}>
            <Button className="btn-favorite" onClick={() => navigate("/favorite")}>
              Ver Mis Favoritos
            </Button>
            <Button className="custom-button" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </Navbar>
  );

  if (loading) {
    return (
      <>
        {renderNavbar()}
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando favoritos...</span>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        {renderNavbar()}
        <div className="text-center py-5">
          <p>Error: {error}</p>
          <Link to="/home" className="btn custom-button">
            Volver al inicio
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      {renderNavbar()}
      <Container className="py-5">
        {favoriteComics.length === 0 ? (
          <div className="comic-card p-4 text-center" style={{ maxWidth: "1000px", margin: "auto" }}>
            <p className="color-negro">No tienes cómics favoritos aún.</p>
            <Link to="/home" className="btn custom-button mt-3">
              Volver al inicio
            </Link>
          </div>
        ) : (
          <>
            <div className="d-flex flex-column gap-4">
              {favoriteComics.map((comic) => (
                <Card key={comic.favoriteId} className="mb-4" style={{ maxWidth: "1000px", margin: "auto" }}>
                  <Row className="g-0">
                    <Col md={5}>
                      <Card.Img
                        src={comic.imageUrl}
                        alt={comic.title}
                        style={{ width: "100%", height: "400px", objectFit: "cover" }}
                      />
                    </Col>
                    <Col md={7}>
                      <Card.Body>
                        <Card.Title className="color-negro mb-3">{comic.title}</Card.Title>
                        <Card.Text className="color-negro mb-2">
                          <span className="fw-bold  color-secondary">Autor: </span>
                          {comic.author}
                        </Card.Text>
                        <Card.Text className="color-negro mb-2">
                          <span className="fw-bold color-secondary">Referencia: </span>
                          {comic.reference}
                        </Card.Text>
                        <Card.Text className="color-negro mb-2">
                          <span className="fw-bold color-secondary">Páginas: </span>
                          {comic.pages}
                        </Card.Text>
                        <Card.Text className="color-negro mb-4">{comic.description}</Card.Text>
                        <Button className="custom-button" onClick={() => openDeleteModal(comic)}>
                          Eliminar de favoritos
                        </Button>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              ))}
            </div>
            {/* Paginación */}
            <div className="pagination-container mt-4" style={{ textAlign: "center" }}>
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
          </>
        )}
      </Container>

      {/* Modal de confirmación */}
      <Modal show={showModal} onHide={cancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de eliminar este cómic de tus favoritos?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancelar
          </Button>
          <Button className="custom-button" onClick={confirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FavoritePage;
