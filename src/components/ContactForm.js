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
    axios
      .get("https://cors-anywhere.herokuapp.com/https://teamelizabethmartinez.com/wp-json/wp/v2/categories")
      .then((response) => {
        setCategories(response.data);
        setSelectedCategory(response.data.length > 0 ? response.data[0].id : "");
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
    
    if (!title || !editorContent || !selectedCategory) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    let imageId = null;
    if (featuredImage) {
      const formData = new FormData();
      formData.append("file", featuredImage);
      try {
        const imageResponse = await axios.post(
          "https://teamelizabethmartinez.com/wp-json/wp/v2/media",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        imageId = imageResponse.data.id;
      } catch (error) {
        console.error("Error al subir la imagen destacada:", error);
        alert("No se pudo subir la imagen destacada.");
        return;
      }
    }

    const postData = {
      title,
      content: editorContent,
      categories: [selectedCategory],
      status,
      featured_media: imageId,
    };

    try {
      const postResponse = await axios.post(
        "https://teamelizabethmartinez.com/wp-json/wp/v2/posts",
        postData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Entrada creada:", postResponse.data);
      setShowAlert(true);

      setTitle("");
      setEditorContent("");
      setSelectedCategory(categories.length > 0 ? categories[0].id : "");
      setStatus("publish");
      setFeaturedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error al crear la entrada:", error);
      alert("No se pudo crear la entrada.");
    }
  };

  return (
    <div className="Box-content">
      {showAlert && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
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
          <ReactQuill theme="snow" value={editorContent} onChange={handleEditorChange} className="Content-Editor" />
        </div>

        <div className="mb-6">
          <label className="block mb-2">Categoría:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-2">Imagen destacada:</label>
          <input type="file" onChange={handleImageChange} className="border border-gray-300 rounded px-3 py-2" />
          {imagePreview && <img src={imagePreview} alt="Imagen destacada" className="mt-3 w-full rounded max-w-xs h-auto" />}
        </div>

        <div className="mb-6">
          <label className="block mb-2">Estado:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="publish">Publicado</option>
            <option value="draft">No publicado</option>
          </select>
        </div>

        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Crear entrada
        </button>
      </form>
    </div>
  );
}

export default CreatePostForm;
