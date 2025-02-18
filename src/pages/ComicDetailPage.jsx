import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getComicDetails } from "../services/comicService";

const ComicDetailPage = () => {
  const { id } = useParams();
  console.log(id);
  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p>Cargando detalles...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!comic) return <p>No se encontró el cómic.</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "auto", textAlign: "center" }}>
      <h1>{comic.title}</h1>
      <img src={comic.imageUrl} alt={comic.title} width={250} style={{ borderRadius: "10px" }} />
      <p><strong>Autor:</strong> {comic.author}</p>
      <p><strong>Referencia:</strong> {comic.reference}</p>
      <p><strong>Páginas:</strong> {comic.pages}</p>
      <p>{comic.description}</p>
      
      {/* Botón para volver a Home */}
      <Link to="/home" style={{ display: "inline-block", marginTop: "10px", padding: "10px 20px", backgroundColor: "#007bff", color: "#fff", borderRadius: "5px", textDecoration: "none" }}>
        Volver al inicio
      </Link>
    </div>
  );
};

export default ComicDetailPage;
