import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const Game = () => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameActive, setGameActive] = useState(true);
  const [gamePaused, setGamePaused] = useState(false);
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);
  const [playerX, setPlayerX] = useState(175);

  const gameContainerRef = useRef(null);
  const playerRef = useRef(null);
  const trashIntervalRef = useRef(null);
  const keysRef = useRef({ left: false, right: false });
  const fallSpeedMultiplierRef = useRef(1);
  const trashSpawnIntervalRef = useRef(1000);

  const backgrounds = [
    'url("../assets/images/background1.jpg")',
    'url("../assets/images/background2.jpg")',
    'url("../assets/images/background3.jpg")',
    'url("../assets/images/background4.jpg")',
    'url("../assets/images/background5.jpg")',
    'url("../assets/images/background6.jpg")'
  ];

  const trashImages = [
    '../assets/images/trash1.png',
    '../assets/images/trash3.png',
    '../assets/images/trash4.png'
  ];

  const updateBackground = (currentScore) => {
    const changeInterval = 30;
    const newBackgroundIndex = Math.floor(currentScore / changeInterval) % backgrounds.length;
    
    if (newBackgroundIndex !== currentBackgroundIndex) {
      setCurrentBackgroundIndex(newBackgroundIndex);
      document.body.style.backgroundImage = backgrounds[newBackgroundIndex];
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
    }
  };

  const checkTrashCollision = (playerRect, trashRect) => {
    const topCollision = 
      trashRect.bottom >= playerRect.top &&
      trashRect.top <= playerRect.bottom &&
      trashRect.right >= playerRect.left &&
      trashRect.left <= playerRect.right;

    const sideCollision = 
      trashRect.right >= playerRect.left &&
      trashRect.left <= playerRect.right &&
      trashRect.bottom >= playerRect.top &&
      trashRect.top <= playerRect.bottom;

    return topCollision || sideCollision;
  };

  const createTrash = () => {
    if (!gameActive || gamePaused) return;

    const trash = document.createElement('div');
    const randomTrashImage = trashImages[Math.floor(Math.random() * trashImages.length)];
    
    trash.classList.add('trash');
    trash.style.left = `${Math.random() * 370}px`;
    trash.style.top = '0px';
    trash.innerHTML = `<img src="${randomTrashImage}" alt="Basura" style="width: 100%; height: 100%; object-fit: contain;">`;
    gameContainerRef.current?.appendChild(trash);

    let trashY = 0;
    let missed = false;

    const fallInterval = setInterval(() => {
      if (!gameActive || gamePaused) {
        trash.dataset.fallInterval = fallInterval.toString();
        clearInterval(fallInterval);
        return;
      }

      trashY += 5 * fallSpeedMultiplierRef.current;
      trash.style.top = `${trashY}px`;

      const playerRect = playerRef.current?.getBoundingClientRect();
      const trashRect = trash.getBoundingClientRect();

      if (playerRect && checkTrashCollision(playerRect, trashRect)) {
        gameContainerRef.current?.removeChild(trash);
        clearInterval(fallInterval);
        const newScore = score + 1;
        setScore(newScore);
        updateBackground(newScore);

        if (newScore % 5 === 0) {
          clearInterval(trashIntervalRef.current);
          trashSpawnIntervalRef.current = Math.max(400, trashSpawnIntervalRef.current - 20);
          trashIntervalRef.current = setInterval(createTrash, trashSpawnIntervalRef.current);
        }
      }

      if (trashY > 550 && !missed) {
        missed = true;
        const newLives = lives - 1;
        setLives(newLives);
        gameContainerRef.current?.removeChild(trash);
        clearInterval(fallInterval);

        if (newLives <= 0) {
          setGameActive(false);
        }
      }
    }, 50);
  };

  const initGame = () => {
    setPlayerX(175);
    setScore(0);
    setLives(3);
    setGameActive(true);
    setGamePaused(false);
    fallSpeedMultiplierRef.current = 1;
    trashSpawnIntervalRef.current = 1000;

    const trashElements = document.querySelectorAll('.trash');
    trashElements.forEach(trash => trash.remove());

    if (trashIntervalRef.current) clearInterval(trashIntervalRef.current);
    trashIntervalRef.current = setInterval(createTrash, trashSpawnIntervalRef.current);
  };

  const pauseGame = () => {
    if (!gameActive) return;
    
    const newPausedState = !gamePaused;
    setGamePaused(newPausedState);
    
    if (newPausedState) {
      clearInterval(trashIntervalRef.current);
      const trashElements = document.querySelectorAll('.trash');
      trashElements.forEach(trash => {
        trash.dataset.pausedY = trash.style.top;
        trash.dataset.fallInterval = trash.dataset.fallInterval || 'active';
      });
    } else {
      trashIntervalRef.current = setInterval(createTrash, trashSpawnIntervalRef.current);
    }
  };

  useEffect(() => {
    document.body.style.backgroundImage = backgrounds[0];
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';

    const handleKeyDown = (e) => {
      if (gamePaused || !gameActive) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysRef.current.left = true;
        playerRef.current.querySelector('img').style.transform = 'scaleX(1)';
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysRef.current.right = true;
        playerRef.current.querySelector('img').style.transform = 'scaleX(-1)';
      }
      if (e.key === 'Escape') {
        pauseGame();
      }
    };

    const handleKeyUp = (e) => {
      if (gamePaused || !gameActive) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = false;
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && gameActive && !gamePaused) {
        pauseGame();
      }
    };

    const gameLoop = () => {
      if (!gameActive || gamePaused) return;

      if (keysRef.current.left && playerX > 0) {
        setPlayerX(prev => Math.max(0, prev - 5));
      }
      if (keysRef.current.right && playerX < 350) {
        setPlayerX(prev => Math.min(350, prev + 5));
      }

      fallSpeedMultiplierRef.current = Math.min(3, 1 + (score * 0.01));
      requestAnimationFrame(gameLoop);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const animationFrame = requestAnimationFrame(gameLoop);
    trashIntervalRef.current = setInterval(createTrash, trashSpawnIntervalRef.current);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrame);
      if (trashIntervalRef.current) clearInterval(trashIntervalRef.current);
    };
  }, [gameActive, gamePaused, playerX, score]);

  return (
    <div>
      <Navbar />
      <div id="gameContainer" ref={gameContainerRef}>
        <div id="scoreDisplay">Puntos: {score}</div>
        <div id="livesDisplay">Vidas: {lives}</div>
        <button id="pauseButton" onClick={pauseGame}>
          {gamePaused ? 'Continuar' : 'Pausar'}
        </button>
        
        <div 
          id="player" 
          ref={playerRef}
          style={{
            left: `${playerX}px`,
            width: '50px',
            height: '50px',
            position: 'absolute',
            bottom: '10px'
          }}
        >
          <img 
            src="../assets/images/player.png" 
            alt="Jugador" 
            style={{ width: '100%', height: '100%' }} 
          />
        </div>
        
        {gamePaused && (
          <div id="pauseScreen" style={{ display: 'flex' }}>
            <h1>Juego Pausado</h1>
            <div id="pauseScreenScore">Puntos: {score}</div>
            <button onClick={pauseGame}>Continuar</button>
            <Link to="/" className="btn">Volver al Inicio</Link>
          </div>
        )}
        
        {!gameActive && (
          <div id="gameOverScreen" style={{ display: 'flex' }}>
            <h1>¡Perdiste!</h1>
            <p id="finalScoreDisplay">Puntuación final: {score}</p>
            <button onClick={initGame}>Volver a Jugar</button>
            <Link to="/" className="btn">Volver al Inicio</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;