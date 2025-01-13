import React from "react";
import Videofondo from '../assets/videos/videofondo2.mp4'
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Index = () => {
  const { token, logout } = useAuth();

  return (
    <div>
      <nav>
            <ul>
              <li>
                <Link to="/">Inicio</Link>
              </li>
                  <li>
                  <Link to="/aboutus">Conócenos</Link>
                  </li>
                  <li>
                  <Link to="/ranking">Ranking</Link>
                  </li>
                  <li>
                  <Link to="/plantations">🌱Plantaciones🌱</Link>
                  </li>
                  <li>
                  <Link to="/knowmore">Saber más!</Link>
                  </li>
                  <li>
                    <button onClick={logout} >Cerrar Sesión</button>
                  </li>
            </ul>
          </nav>
      <section className="banner" id="inicio">
        <div className="video-container">
          <video  autoPlay muted loop playsInline className="bg-video">
            <source src={Videofondo} type="video/mp4" />
            Tu navegador no soporta videos HTML5.
          </video>
        </div>
        <div className="banner-content">
          <h1>Clean It Up!</h1>
          {token ? (
            <Link to="/game" className="btn">
              Jugar
            </Link>
          ) : (
            <div>
              <Link to="/login" className="btn">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="btn">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
