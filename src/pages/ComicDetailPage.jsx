import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UseAuth } from "../context/AuthContext"; // Para la lógica de autenticación

const ComicDetailPage = () => {
  const { id } = useParams(); // Obtener el ID del cómic desde la URL
  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = UseAuth();
  const navigate = useNavigate();

  // Función para obtener los detalles del cómic
  const fetchComicDetails = async () => {
    try {
      const response = await fetch(`https://localhost:7047/api/comic/${id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Cómic no encontrado o error en el servidor.");
      }

      const data = await response.json();
      setComic(data); // Guardar los datos del cómic en el estado
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComicDetails();
  }, [id]); // Repetir cuando el ID cambie

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{comic.title}</h1>
      <img src={comic.imageUrl} alt={comic.title} />
      <p><strong>Autor:</strong> {comic.author}</p>
      <p><strong>Descripción:</strong> {comic.description}</p>
      <p><strong>Páginas:</strong> {comic.pages}</p>
      <p><strong>Referencia:</strong> {comic.reference}</p>
      {/* Si lo deseas, puedes agregar un botón para regresar a la página principal */}
      <button onClick={() => navigate("/home")}>Volver al Home</button>
    </div>
  );
};

export default ComicDetailPage;
