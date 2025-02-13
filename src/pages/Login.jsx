import React, { useState } from "react";
import "../assets/styles/Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [nombre, setUsername] = useState("");
  const [clave, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLoginClick = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, clave }),
      });
      if (!response.ok) throw new Error("Error en la autenticación");

      navigate("/Books");
    } catch (error) {
      setError("Error en la autenticación. Verifica tus credenciales.");
    }
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPasswordModal(true);
  };

  const handleCloseModal = () => {
    setShowForgotPasswordModal(false);
  };

  const handleSendEmail = () => {
    alert("Se ha enviado un correo para restablecer la contraseña.");
    setShowForgotPasswordModal(false);
  };

  return (
    <div className="login-page">
      <div className="container">
        <p className="brand">Bookshelf Reader</p>
        <div className="card">
          <h2 className="title">Iniciar sesión</h2>
          <form className="form" onSubmit={handleLoginClick}>
            <label className="label">Nombre de usuario:</label>
            <input
              type="text"
              className="input"
              value={nombre}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label className="label">Contraseña:</label>
            <input
              type="password"
              className="input"
              value={clave}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="button">
              Iniciar sesión
            </button>
          </form>
          <div className="links">
            <a href="#" className="link" onClick={handleForgotPasswordClick}>
              He olvidado la contraseña
            </a>
            <a href="/Register" className="link">
              Registrar cuenta
            </a>
            <a
              href="../../public/DockDockDock/Introduction.html"
              className="link"
              target="_blank"
            >
              Ayuda
            </a>
          </div>
        </div>

        {showForgotPasswordModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Recuperar contraseña</h3>
              <label className="label">Correo electrónico:</label>
              <input
                type="email"
                className="input"
                placeholder="Introduce tu correo"
              />
              <button className="button" onClick={handleSendEmail}>
                Enviar
              </button>
              <button className="close-button" onClick={handleCloseModal}>
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
