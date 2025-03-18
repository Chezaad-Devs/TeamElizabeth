import React, { useState, useEffect } from "react";
import axios from "axios"; // Importa Axios
import "../styles/Post.css";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import ReactQuill from "react-quill";
import "../styles/content.css";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

export default function Card({ post }) {
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editedPostData, setEditedPostData] = useState({
    // Inicializa los datos editados con los datos del post actual
    title: post.title.rendered,
    content: post.content.rendered,
    categories: post.categories, // Agregar las categorías del post
    featured_media: null,
    status: "publish",
  });
  const [categories, setCategories] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        if (
          post?._links &&
          post._links["wp:featuredmedia"] &&
          post._links["wp:featuredmedia"][0]?.href
        ) {
          const response = await axios.get(
            post._links["wp:featuredmedia"][0].href
          ); // Usa Axios para obtener la imagen
          setImage(response.data.source_url);
          console.log(response.data.source_url);
        }
      } catch (error) {
        console.error("Error fetching image:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [post]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://teamelizabethmartinez.com/wp-json/wp/v2/categories"
        ); // Usa Axios para obtener las categorías
        setCategories(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Handle error
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setEditedPostData({
      ...editedPostData,
      featured_media: imageFile,
    });
  };

  const handleDelete = async (id) => {
    console.log(id);

    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este post?"
    );
    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(
        `https://teamelizabethmartinez.com/?rest_route=/wp/v2/posts/${id}&JWT=${token}`
      );
      window.location.href = "dashboard";
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEdit = () => {
    setShowModal(true); // Abre el modal al hacer clic en el enlace de editar
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", editedPostData.title);
      formData.append("content", editedPostData.content);
      formData.append("status", editedPostData.status);
      formData.append("categories", editedPostData.categories);
      if (editedPostData.featured_media) {
        formData.append("featured_media", editedPostData.featured_media);
      }

      await axios.put(
        `https://teamelizabethmartinez.com/?rest_route=/wp/v2/posts/${post.id}&JWT=${token}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowModal(false);
      navigate("/dashboard");

      // Si la actualización es exitosa, puedes hacer alguna acción adicional aquí, como recargar la lista de posts.
    } catch (error) {
      console.error("Falla en actualizar:", error);
      // Puedes manejar el error de alguna manera, como mostrando un mensaje al usuario.
    }
  };

  const handleInputChange = (e) => {
    if (e.target) {
      const { name, value } = e.target;
      setEditedPostData({
        ...editedPostData,
        [name]: value,
      });
    } else {
      // Cuando el cambio proviene del editor ReactQuill
      setEditedPostData({
        ...editedPostData,
        content: e, // 'e' es el contenido del editor ReactQuill
      });
    }
  };

  return (
    <>
      <div className="card-container">
        {image && (
          <img className="image" src={image} alt={post.title.rendered} />
        )}
        <h1 className="title">{post.title.rendered}</h1>
        <div className="card-body">
          <p className="date">
            Publicado {new Date(post.date).toLocaleDateString()}
          </p>

          <div className="container-button">
            <Link to="#" className="Btn-link" onClick={handleEdit}>
              Editar
            </Link>
            <button onClick={() => handleDelete(post.id)} className="Btn-link">
              Eliminar
            </button>
          </div>
        </div>
      </div>

      {/* Modal para editar */}
      {showModal && (
        <Modal closeModal={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="form">
            <div className="mb-6">
              <label className="block mb-2">Título:</label>
              <input
                type="text"
                name="title"
                value={editedPostData.title}
                onChange={(e) => handleInputChange(e)}
                className=""
                style={{ width: "100%", fontSize: "14px" }}
              />
            </div>
            <div className="mb-8">
              <label className="block mb-2">Contenido:</label>
              <ReactQuill
                value={editedPostData.content}
                onChange={(content) => handleInputChange(content)} // Cambio aquí
                className=""
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2">Imagen actual:</label>
              {image && (
                <img
                  src={image}
                  alt="Imagen actual"
                  style={{ maxWidth: "100%", marginBottom: "10px" }}
                />
              )}
              <label className="block mb-2">Imagen nueva:</label>
              <input type="file" onChange={handleImageChange} className="" />
              {editedPostData.featured_media && (
                <img
                  src={URL.createObjectURL(editedPostData.featured_media)}
                  alt="Imagen nueva"
                  style={{ maxWidth: "100%", marginTop: "10px" }}
                />
              )}
            </div>

            <div className="mb-6">
              <label className="block mb-2">Categoría:</label>
              <select
                name="categories"
                value={editedPostData.categories || ""}
                onChange={handleInputChange}
                className=""
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <select
                value={editedPostData.status || ""}
                onChange={(e) => handleInputChange(e)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                style={{ width: "100%" }}
              >
                <option value="publish">Publicado</option>
                <option value="draft">No publicado</option>
              </select>
            </div>
            <div className="Acciones">
              {" "}
              <button type="submit" className="Btn-Actualizar">
                Actualizar
              </button>
              <button
                className="Btn-Cancelar"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
