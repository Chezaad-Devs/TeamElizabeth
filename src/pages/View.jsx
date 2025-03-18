import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import NavBar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "../styles/view.css";

function View() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  // const history = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://teamelizabethmartinez.com/?rest_route=/wp/v2/posts&JWT=${token}&per_page=15&orderby=date&order=desc`

        );

        if (!response.ok) {
          throw new Error("No tienes autorización");
        }

        const postData = await response.json();
        setData(postData);
        console.log("los datos esta aqui:" , postData);
      } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // const handleLogout = () => {
  //   localStorage.clear();
  //   history("/login", { replace: true });
  // };

  const updatePost = async (updatedPost) => {
    try {
      // Lógica para actualizar el post en la API
      // await axios.put(...)
      // Después de actualizar el post en la API, actualizar localmente
      const updatedPosts = data.map((post) =>
        post.id === updatedPost.id ? updatedPost : post
      );
      setData(updatedPosts);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  if (loading) {
    return <h1>Cargando los posts...</h1>;
  }

  return (
    <div>
      <NavBar />
      <section className="wrap">
        {data.length > 0 ? (
          data.map((item) => (
            <Card key={item.id} post={item} updatePost={updatePost} />
          ))
        ) : (
          <h1 className="mt-5 font-bold text-3xl">No hay posts disponibles</h1>
        )}
      </section>
    </div>
  );
}

export default View;
