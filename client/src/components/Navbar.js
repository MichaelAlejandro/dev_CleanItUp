import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { token, logout } = useAuth();

  return (
    <nav>
      <ul>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/aboutus">Conócenos</Link></li>
        <li><Link to="/ranking">Ranking</Link></li>
        <li><Link to="/plantations">🌱Plantaciones🌱</Link></li>
        <li><Link to="/knowmore">Saber más!</Link></li>
        {token && (
          <li>
            <button onClick={logout}>Cerrar Sesión</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;