import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { token, logout } = useAuth();

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Inicio</Link>
        </li>
        {token ? (
          <>
            <li>
              <a href="/aboutus">Conócenos</a>
            </li>
            <li>
              <a href="/ranking">Ranking</a>
            </li>
            <li>
              <a href="/plantations">🌱Plantaciones🌱</a>
            </li>
            <li>
              <a href="/knowmore">Saber más!</a>
            </li>
            <li>
              <button onClick={logout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
