import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "../styles/content.css";
import "react-quill/dist/quill.snow.css"; // Estilo predeterminado del editor de texto

function CreatePostForm() {
  const [title, setTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [status, setStatus] = useState("publish"); // Estado predeterminado: publicado
  const [featuredImage, setFeaturedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Obtener las categorías disponibles desde WordPress
    axios
      .get("https://teamelizabethmartinez.com/wp-json/wp/v2/categories")
      .then((response) => {
        setCategories(response.data);
        setSelectedCategory(response.data[0]?.id); // Establecer la primera categoría como la seleccionada por defecto
      })
      .catch((error) => {
        console.error("Error al obtener las categorías:", error);
      });
  }, []);

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setFeaturedImage(imageFile);
    setImagePreview(URL.createObjectURL(imageFile));
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", featuredImage);

    try {
      // Subir la imagen destacada
      const imageResponse = await axios.post(
        `https://teamelizabethmartinez.com/?rest_route=/wp/v2/media`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Agrega el token de autorización si es necesario
          },
        }
      );

      // Crear la entrada con la URL de la imagen destacada
      const postData = {
        title,
        content: editorContent,
        categories: [selectedCategory],
        status,
        featured_media: imageResponse.data.id, // ID de la imagen subida
      };

      const postResponse = await axios.post(
        `https://teamelizabethmartinez.com/?rest_route=/wp/v2/posts&JWT=${token}`,
        postData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Agrega el token de autorización si es necesario
          },
        }
      );

      console.log("Entrada creada:", postResponse.data);

      // Mostrar la alerta de éxito
      setShowAlert(true);

      // Limpiar el formulario después de mostrar la alerta
      setTitle("");
      setEditorContent("");
      setSelectedCategory("");
      setStatus("publish");
      setFeaturedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error al crear la entrada:", error);
    }
  };

  return (
    <div className="Box-content">
      {/* Alerta de éxito */}
      {showAlert && (
        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4"
          role="alert"
        >
          <p className="font-bold">¡Entrada creada correctamente!</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="form">
        <div className="mb-6">
          <label className="block mb-2">Título:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-8">
          <label className="block mb-2">Contenido:</label>

          <ReactQuill
            theme="snow"
            value={editorContent}
            onChange={handleEditorChange}
            className="Content-Editor"
            // style={{ height: "100px" }}
          />
          {""}
        </div>

        <div className="mb-6">
          <label className="block mb-2">Categoría:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-2">Imagen destacada:</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          />
          {imagePreview && ( // Mostrar la previsualización si hay una imagen seleccionada
            <img
              src={imagePreview}
              alt="Featured Image"
              className="mt-3 w-full rounded max-w-xs h-auto"
            />
          )}
        </div>
        <div className="mb-6">
          <label className="block mb-2">Estado:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="publish">Publicado</option>
            <option value="draft">No publicado</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Crear entrada
        </button>
      </form>
    </div>
  );
}

export default CreatePostForm;
