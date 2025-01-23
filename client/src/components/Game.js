import React, { useState, useEffect, useRef } from 'react';

export default function Game() {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameActive, setGameActive] = useState(true);
  const [gamePaused, setGamePaused] = useState(false);
  const [playerX, setPlayerX] = useState(175);
  const [character, setCharacter] = useState(null); // Aquí guardamos el main character
  const [backgroundIndex, setBackgroundIndex] = useState(0);

  // Array de basura:
  const [trashes, setTrashes] = useState([]);

  // Teclas
  const keysRef = useRef({ left: false, right: false });

  // Imágenes de fondo (opc) o usar body css
  const backgrounds = [
    '/assets/background1.jpg',
    '/assets/background2.jpg',
    '/assets/background3.jpg',
    '/assets/background4.jpg',
    '/assets/background5.jpg',
    '/assets/background6.jpg',
  ];

  // Imágenes de basura
  const trashImgs = [
    '/assets/trash1.png',
    '/assets/trash3.png',
    '/assets/trash4.png',
  ];

  // ================ 1) OBTENER MAIN CHARACTER =================
  useEffect(() => {
    const fetchMainCharacter = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/characters/main');
        if (!res.ok) throw new Error('No se pudo obtener el personaje');
        const data = await res.json();
        setCharacter(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMainCharacter();
  }, []);

  // ================ 2) ESCUCHAR TECLAS ================
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameActive || gamePaused) return;
      if (e.key === 'ArrowLeft') keysRef.current.left = true;
      if (e.key === 'ArrowRight') keysRef.current.right = true;
      if (e.key === 'Escape') setGamePaused((p) => !p);
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
  }, [gameActive, gamePaused]);

  // ================ 3) GAMELOOP con requestAnimationFrame ================
  useEffect(() => {
    let animId;
    const loop = () => {
      if (gameActive && !gamePaused) {
        // mover player
        setPlayerX((prev) => {
          let newX = prev;
          if (keysRef.current.left && newX > 0) newX -= 5;
          if (keysRef.current.right && newX < 350) newX += 5;
          return newX;
        });
        // mover basura
        setTrashes((prev) =>
          prev
            .map((t) => ({ ...t, y: t.y + t.speed }))
            .filter((t) => {
              // si se sale => loseLife
              if (t.y > 550) {
                loseLife();
                return false;
              }
              // checar colisión
              const playerRect = { x: playerX, y: 550, width: 50, height: 50 };
              const trashRect = { x: t.x, y: t.y, width: 30, height: 30 };
              if (checkCollision(playerRect, trashRect)) {
                gainPoint();
                return false;
              }
              return true;
            })
        );
      }
      animId = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(animId);
  }, [gameActive, gamePaused]);

  // ================ 4) SPAWN BASURA =================
  const spawnRef = useRef(null);
  useEffect(() => {
    if (!gameActive) return;
    if (gamePaused) {
      clearInterval(spawnRef.current);
    } else {
      spawnRef.current = setInterval(() => {
        const x = Math.random() * 370;
        const speed = 5;
        const img = trashImgs[Math.floor(Math.random() * trashImgs.length)];
        setTrashes((prev) => [
          ...prev,
          { id: Date.now() + Math.random(), x, y: 0, speed, img },
        ]);
      }, 1000);
    }
    return () => clearInterval(spawnRef.current);
  }, [gameActive, gamePaused]);

  // ================ FUNCIONES ================
  function checkCollision(r1, r2) {
    return !(
      r2.x > r1.x + r1.width ||
      r2.x + r2.width < r1.x ||
      r2.y > r1.y + r1.height ||
      r2.y + r2.height < r1.y
    );
  }

  const gainPoint = () => {
    setScore((prev) => {
      const newScore = prev + 1;
      checkBackgroundChange(newScore);
      return newScore;
    });
  };

  const loseLife = () => {
    setLives((l) => {
      const newLives = l - 1;
      if (newLives <= 0) endGame();
      return newLives;
    });
  };

  const checkBackgroundChange = (newScore) => {
    // cambia cada 30
    const changeInterval = 30;
    const newIndex = Math.floor(newScore / changeInterval) % backgrounds.length;
    setBackgroundIndex(newIndex);
  };

  const endGame = () => {
    setGameActive(false);
    setGamePaused(false);
  };

  const initGame = () => {
    setScore(0);
    setLives(3);
    setGameActive(true);
    setGamePaused(false);
    setPlayerX(175);
    setTrashes([]);
    setBackgroundIndex(0);
  };

  // ================ ESTILOS ================
  // OJO: Si quieres que el fondo ocupe toda la PANTALLA,
  // puedes ponerlo en body (CSS) o en un contenedor 100vw x 100vh
  const containerStyle = {
    width: '400px',
    height: '600px',
    position: 'relative',
    margin: '20px auto',
    border: '5px solid rgb(50,143,219)',
    borderRadius: '15px',
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.5)',
    backgroundImage: `url(${backgrounds[backgroundIndex]})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const playerStyle = {
    position: 'absolute',
    bottom: '10px',
    left: `${playerX}px`,
    width: '50px',
    height: '50px',
    // Si hay un main character con una imagen => /assets/loquesea.png
    backgroundImage: character ? `url("/uploads/${character.image}")` : 'none',
    backgroundSize: 'cover',
  };

  return (
    <div style={{ /* si quieres un background global, usa body CSS. */ }}>
      <div style={containerStyle}>
        {/* HUD */}
        <div style={{
          position: 'absolute',
          top: '10px', left: '10px',
          padding: '6px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #A1C4FD, #C2E9FB)',
        }}>
          Puntos: {score}
        </div>
        <div style={{
          position: 'absolute',
          top: '10px', right: '10px',
          padding: '6px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #A1C4FD, #C2E9FB)',
        }}>
          Vidas: {lives}
        </div>

        <button onClick={() => setGamePaused(!gamePaused)} style={{
          position: 'absolute',
          top: '10px', left: '50%',
          transform: 'translateX(-50%)',
          padding: '5px 10px',
          backgroundColor: 'rgb(50,143,219)',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}>
          {gamePaused ? 'Continuar' : 'Pausar'}
        </button>

        {/* Jugador */}
        <div style={playerStyle} />

        {/* Basura */}
        {trashes.map((t) => (
          <div key={t.id} style={{
            position: 'absolute',
            left: t.x,
            top: t.y,
            width: '30px',
            height: '30px',
          }}>
            <img
              src={t.img}
              alt="trash"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        ))}

        {/* GAME OVER */}
        {!gameActive && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center',
            color: '#fff', zIndex: 10,
          }}>
            <h1>¡Perdiste!</h1>
            <p>Puntuación final: {score}</p>
            <button onClick={initGame}>Volver a Jugar</button>
          </div>
        )}
      </div>
    </div>
  );
}
