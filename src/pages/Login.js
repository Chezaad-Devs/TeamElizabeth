import React, { useState } from "react";
import axios from "axios";
import Logo from "../img/Logo.webp";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const ApiUrl = process.env.REACT_APP_API_URL_Login;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Por favor ingresa un correo electrónico.";
    if (!formData.password) newErrors.password = "Por favor ingresa una contraseña.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({}); // Resetear errores antes de enviar

    try {
      const response = await axios.post(ApiUrl, {
        ...formData,
        AUTH_KEY: process.env.REACT_APP_AUTH_KEY, // Usar variable de entorno
      });

      const token = response.data.data?.jwt;
      if (token) {
        localStorage.setItem("token", token);
        navigate("/teamelizabethmartinez");
      } else {
        throw new Error("Respuesta inesperada del servidor.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setErrors({ general: "Las credenciales ingresadas son incorrectas." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="inner-container">
        <figure>
          <img className="logo" src={Logo} alt="Logo del aldia pais" />
        </figure>
        <h2 className="Title">Iniciar sesión</h2>

        {errors.general && <p className="error-message">{errors.general}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input">
            <label htmlFor="email" className="label">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              className="input"
              placeholder="name@domain.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div className="input">
            <label htmlFor="password" className="label">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              className="input"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Cargando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
