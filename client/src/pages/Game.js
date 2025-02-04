import { jwtDecode } from 'jwt-decode';
import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/Game.module.css';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Game() {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameActive, setGameActive] = useState(true);
  const [gamePaused, setGamePaused] = useState(false);
  const [playerX, setPlayerX] = useState(175);
  const [direction, setDirection] = useState('right'); // Nueva dirección
  const [character, setCharacter] = useState(null);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [dataUpdated, setDataUpdated] = useState(false);
  
  const trashRef = useRef([]);
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const keysRef = useRef({ left: false, right: false });
  const scoreRef = useRef(0);


  const { token } = useAuth();
  const decodedToken = token ? jwtDecode(token) : null;
  // console.log('Token decodificado:', decodedToken);

  const userId = token ? jwtDecode(token).userId : null;

  const backgrounds = [
    '/assets/background1.jpg',
    '/assets/background2.jpg',
    '/assets/background3.jpg',
    '/assets/background4.jpg',
    '/assets/background5.jpg',
    '/assets/background6.jpg',
  ];

  const trashImgs = [
    '/assets/trash1.png',
    '/assets/trash3.png',
    '/assets/trash4.png',
  ];

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);
  
  // Obtener el personaje principal
  useEffect(() => {
    const fetchMainCharacter = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/characters/main');
        if (!res.ok) throw new Error('No se pudo obtener el personaje principal');
        const data = await res.json();
        setCharacter(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMainCharacter();
  }, []);

  // Actualización del fondo basado en el puntaje
  useEffect(() => {
    const interval = 5; // Intervalo de puntaje para cambiar el fondo
    const newIndex = Math.floor(score / interval) % backgrounds.length;
    setBackgroundIndex(newIndex);
  }, [score, backgrounds]);


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        keysRef.current.left = true;
        setDirection('left'); // Actualizar dirección
      }
      if (e.key === 'ArrowRight') {
        keysRef.current.right = true;
        setDirection('right'); // Actualizar dirección
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft') keysRef.current.left = false;
      if (e.key === 'ArrowRight') keysRef.current.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  

  // Movimiento del personaje
  useEffect(() => {
    const movePlayer = () => {
      if (!gameActive) return;

      setPlayerX((prevX) => {
        let newX = prevX;
        if (keysRef.current.left && newX > 0) newX -= 5;
        if (keysRef.current.right && newX < 350) newX += 5;
        return newX;
      });
    };

    const interval = setInterval(() => {
      if (!gamePaused) {
        movePlayer();
      }
    }, 16);

    return () => clearInterval(interval);
  }, [gameActive, gamePaused]);



  const moveTrash = () => {
    if (!gameActive || gamePaused) return;
  
    trashRef.current = trashRef.current
    .map((trash) => ({
      ...trash,
      y: trash.y + trash.speed, // Mueve la basura hacia abajo
    }))
    .filter((trash) => {
      if (trash.processed) return false; // Ignora basuras ya procesadas

      const playerElement = document.querySelector(`.${styles.player}`);
      const trashElement = document.querySelector(`[data-id="${trash.id}"]`);

      if (!playerElement || !trashElement) return true;

      // Detectar colisión
      if (checkCollision(playerElement, trashElement)) {
        console.log("Colisión detectada con basura:", trash.id);
        trash.processed = true; // Marca la basura como procesada
        gainPoint();
        return false; // Elimina la basura tras recogerla
      }

      // Si la basura toca el suelo
      if (trash.y > 550) {
        console.log("Basura tocó el suelo:", trash.id);
        trash.processed = true; // Marca la basura como procesada
        loseLife();
        return false; // Elimina la basura
      }

      return true;
    });





  
    const trashContainer = document.querySelector(`.${styles.trashContainer}`);
    if (trashContainer) {
      // Limpiar el contenedor de basura
      while (trashContainer.firstChild) {
        trashContainer.removeChild(trashContainer.firstChild);
      }
  
      // Renderizar basura actualizada
      trashRef.current.forEach((trash) => {
        const trashDiv = document.createElement('div');
        trashDiv.className = styles.trash;
        trashDiv.style.left = `${trash.x}px`;
        trashDiv.style.top = `${trash.y}px`;
        trashDiv.style.backgroundImage = `url(${trash.img})`;
        trashDiv.setAttribute('data-id', trash.id); // Asigna un atributo único
        trashContainer.appendChild(trashDiv);
      });
    }
  
    animationFrameRef.current = requestAnimationFrame(moveTrash);
  };
  
  
  
  useEffect(() => {
    if (gameActive && !gamePaused) {
      animationFrameRef.current = requestAnimationFrame(moveTrash);
    }
  
    return () => {
      cancelAnimationFrame(animationFrameRef.current); // Detener la animación si cambia algo
    };
  }, [gameActive, gamePaused]);
  

  // Generar basura periódicamente
  useEffect(() => {
    const spawnTrash = () => {
      if (!gamePaused) {
        const x = Math.random() * 370;
        const speed = 2 + Math.random() * 3;
        const img = trashImgs[Math.floor(Math.random() * trashImgs.length)];
        trashRef.current.push({ id: Date.now(), x, y: 0, speed, img });
      }
    };

    const intervalId = setInterval(spawnTrash, 1000);
    return () => clearInterval(intervalId);
  }, [gamePaused]);

  // Verificar colisión
  const checkCollision = (playerElement, trashElement) => {
    const playerRect = playerElement.getBoundingClientRect();
    const trashRect = trashElement.getBoundingClientRect();
  
    return !(
      trashRect.right < playerRect.left || // Basura está a la izquierda del jugador
      trashRect.left > playerRect.right || // Basura está a la derecha del jugador
      trashRect.bottom < playerRect.top || // Basura está por encima del jugador
      trashRect.top > playerRect.bottom // Basura está por debajo del jugador
    );
  };
  
  
  const loseLife = () => {
    if (dataUpdated) {
      console.log("El juego ya se finalizó, no se llama a endGame nuevamente.");
      return;
    }
  
    setLives((prev) => {
      if (prev > 1) {
        return prev - 1;
      } else {
        console.log("Fin del juego: llamando a endGame()");
        endGame();
        return 0;
      }
    });
  };
  

  

  // Aumentar puntaje
  const gainPoint = () => {
    setScore((prev) => prev + 1);
  };



  const endGame = () => {
    if (!gameActive || dataUpdated) {
      console.log("El juego ya ha terminado o los datos ya fueron actualizados.");
      return;
    }
  
    setDataUpdated(true); // Bloquea futuras ejecuciones inmediatamente
  
    const finalScore = scoreRef.current;
    console.log("EndGame llamado. Score:", finalScore);
  
    setGameActive(false);
    setGamePaused(false);
    trashRef.current = [];
  
    if (finalScore > 0) {
      console.log("Llamando a updateGameData con score:", finalScore);
      updateGameData(finalScore);
    }
  };
  
  
  
  
  


  const initGame = () => {
    console.log("Reiniciando el juego...");
    setScore(0);
    setLives(3);
    setGameActive(true);
    setGamePaused(false);
    setBackgroundIndex(0);
    setDataUpdated(false);
    trashRef.current = [];
  };
  
  

// console.log("User ID al iniciar el juego:", userId);
// console.log("Token al iniciar el juego:", token);
  
const updateGameData = async (score) => {
  // console.log("Iniciando updateGameData...");
  // console.log("User ID:", userId);
  // console.log("Score:", score);
  // console.log("Token:", token);

  if (!userId) {
    console.error("No se pudo obtener el userId del token");
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/game-data/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, score }),
    });

    const data = await response.json();
    console.log("Respuesta del backend:", data);
  } catch (error) {
    console.error("Error al guardar los datos del juego:", error);
  }
};



 
  return (
    <div
      className={styles.background}
      style={{
        backgroundImage: `url(${backgrounds[backgroundIndex]})`,
      }}
    >
      

      <div className={styles.gameContainer} ref={containerRef}>
        {/* Contenedor de basura */}
        <div className={styles.trashContainer}></div>

        <div className={styles.scoreDisplay}>Puntos: {score}</div>
        <div className={styles.livesDisplay}>Vidas: {lives}</div>
        <button
          className={styles.pauseButton}
          onClick={() => setGamePaused((prev) => !prev)}
        >
          {gamePaused ? 'Continuar' : 'Pausar'}
        </button>
        {/* Contenedor del jugador */}
        <div
          className={styles.player}
          style={{
            left: `${playerX}px`,
            bottom: '10px',
            backgroundImage: character ? `url(/uploads/${character.image})` : 'none',
            transform: direction === 'left' ? 'scaleX(1)' : 'scaleX(-1)', // Voltea según la dirección
          }}
        ></div>
      </div>


      

      {!gameActive && (
        <div className={styles.gameOverScreen}>
          <h1>¡Perdiste!</h1>
          <p>Puntuación final: {score}</p>
          <button className={styles.restartButton} onClick={initGame}>
            Otra Partida
          </button>
            <Link to="/" className={styles.homeButton}>
              Ir a inicio
            </Link>
        </div>
      )}

      {gamePaused && (
        <div className={styles.gameOverScreen}>
          <h1>Pausa!</h1>
          <p>Puntuación hasta ahora: {score}</p>
          <button
            className={styles.restartButton}
            onClick={() => setGamePaused(false)} // Cambia el estado de pausa
          >
            Volver a Jugar
          </button>
            <Link to="/" className={styles.homeButton}>
              Ir a inicio
            </Link>
        </div>
      )}
    </div>
  );
}