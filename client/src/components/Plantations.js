import React from 'react';
import Navbar from './Navbar';

const Plantations = () => {
  return (
    <div>
      <Navbar />
      <section className="section">
        <div className="plantacion-container">
          <h1 className="title">🌱 Plantación 🌱</h1>
          <p className="description">
            Cada vez que un jugador alcance <strong>250 puntos</strong>, 
            se plantará un árbol en su nombre, contribuyendo a un mundo más verde.
          </p>
          <div className="stats">
            <div className="stat">
              <h2 className="stat-number">100</h2>
              <p className="stat-label">Árboles por plantar</p>
            </div>
            <div className="stat">
              <h2 className="stat-number">45</h2>
              <p className="stat-label">Árboles plantados</p>
            </div>
          </div>
        </div>
        
        <div className="plantacion-list">
          <h2 className="list-title">🌱 Árboles plantados en nombre de nuestros jugadores 🌱</h2>
          <ul className="user-list">
            <li>4 árbol plantado en nombre de <strong>Alexander</strong></li>
            <li>1 árbol plantado en nombre de <strong>Katherine</strong></li>
            <li>2 árbol plantado en nombre de <strong>Alison</strong></li>
            <li>3 árbol plantado en nombre de <strong>KeniaOs</strong></li>
            <li>2 árbol plantado en nombre de <strong>JeremyNakano</strong></li>
            <li>2 árbol plantado en nombre de <strong>Michael</strong></li>
            <li>1 árbol plantado en nombre de <strong>Alejandro</strong></li>
            <li>3 árbol plantado en nombre de <strong>Lana del Rey</strong></li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Plantations;