import React from "react";
import Videofondo from '../assets/videos/videofondo2.mp4'
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from './Navbar';

const Index = () => {
  const { token} = useAuth();

  return (
    <div>
      <Navbar />
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
