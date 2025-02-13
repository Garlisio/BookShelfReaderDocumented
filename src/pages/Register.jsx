import React, { useState } from "react";
import "../assets/styles/Login.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [nombre, setUsername] = useState("");
  const [clave, setPassword] = useState("");
  const [correo, setEmail] = useState("");
  const [error, setError] = useState(null);


  const handleRegisterClick = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, clave, correo }),
      });
      if (!response.ok) throw new Error('Error en el registro');
      navigate("/Login");
    } catch (error) {
      setError("Error en el registro. Verifica los datos ingresados.");
    }
  };

  const handleLoginClick = (event) => {
    event.preventDefault();
    navigate("/Login");
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
          <h2 className="title">Registrar cuenta</h2>
          <form className="form" onSubmit={handleRegisterClick}>
            <label className="label">Correo electrónico:</label>
            <input type="email"
              className="input"
              value={correo}
              onChange={(e) => setEmail(e.target.value)} />

            <label className="label">Contraseña:</label>
            <input type="password"
              className="input"
              value={clave}
              onChange={(e) => setPassword(e.target.value)} />

            <label className="label">Nombre de usuario:</label>
            <input type="text"
              className="input"
              value={nombre}
              onChange={(e) => setUsername(e.target.value)} />

            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="button">
              Crear cuenta
            </button>
          </form>
          <div className="links">
            <a href="#" className="link" onClick={handleForgotPasswordClick}>
              He olvidado la contraseña
            </a>
            <a href="/Login" className="link">
              Iniciar sesión
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
              <button
                className="button close-button"
                onClick={handleCloseModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
