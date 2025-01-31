import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import styles from '../styles/Plantations.module.css';

const Plantations = () => {
  const [treesToPlant, setTreesToPlant] = useState(0);
  const [treesPlanted, setTreesPlanted] = useState(0);
  const [players, setPlayers] = useState([]);
  const [newTreesPlanted, setNewTreesPlanted] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/game-data/trees-stats');
      const data = await response.json();
      setTreesToPlant(data.totalTreesToPlant || 0);
      setTreesPlanted(data.totalTreesPlanted || 0);
      setPlayers(data.players || []);
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
    }
  };

  const handleUpdateTrees = async () => {
    setErrorMessage("");

    if (!newTreesPlanted || newTreesPlanted <= 0) {
      setErrorMessage("Por favor, ingresa una cantidad válida.");
      return;
    }

    if (newTreesPlanted > treesToPlant - treesPlanted) {
      setErrorMessage("La cantidad de árboles plantados no puede exceder los árboles por plantar.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/game-data/update-trees-planted', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ treesPlanted: parseInt(newTreesPlanted) }),
      });

      const data = await response.json();
      if (data.message) {
        setNewTreesPlanted("");
        fetchStats(); 
      } else if (data.error) {
        setErrorMessage(data.error);
      }
    } catch (error) {
      console.error('Error al actualizar árboles:', error);
      setErrorMessage("Ocurrió un error al actualizar los árboles.");
    }
  };

  return (
    <div>
      <Navbar />
      <section className={styles.section}>
        <div className={styles.plantacionContainer}>
          <h1 className={styles.title}>🌱 Plantación 🌱</h1>
          <p className={styles.description}>
            Cada vez que un jugador alcance <strong>250 puntos</strong>, 
            se plantará un árbol en su nombre, contribuyendo a un mundo más verde.
          </p>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <h2 className={styles.statNumber}>{treesToPlant - treesPlanted}</h2>
              <p className={styles.statLabel}>Árboles por plantar</p>
            </div>
            <div className={styles.stat}>
              <h2 className={styles.statNumber}>{treesPlanted}</h2>
              <p className={styles.statLabel}>Árboles plantados</p>
            </div>
          </div>
          <div>
            <input
              type="number"
              className={styles.input}
              placeholder="Árboles plantados"
              value={newTreesPlanted}
              onChange={(e) => setNewTreesPlanted(e.target.value)}
            />
            <button className={styles.button} onClick={handleUpdateTrees}>Actualizar</button>
          </div>
          {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        </div>

        <div className={styles.plantacionList}>
          <h2 className={styles.listTitle}>🌱 Árboles plantados en nombre de nuestros jugadores 🌱</h2>
          <ul className={styles.userList}>
            {players.map((player) => (
              <li key={player.user._id} className={styles.userItem}>
                {player.trees_planted} árbol(es) plantado(s) en nombre de <strong>{player.user.username}</strong>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Plantations;