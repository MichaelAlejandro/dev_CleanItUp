// routes/gameData.js
const express = require('express');
const router = express.Router();
const GameData = require('../models/GameData');

// Obtener los 10 mejores puntajes
router.get('/top-scores', async (req, res) => {
  try {
    const topScores = await GameData.find()
      .sort({ best_score: -1 }) // Orden descendente por mejor puntaje
      .limit(10)
      .populate('user', 'username'); // Incluye el nombre del usuario
    res.status(200).json(topScores);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los mejores puntajes' });
  }
});

// Actualizar puntaje y árboles plantados
router.post('/update', async (req, res) => {
    const { userId, score } = req.body;
    console.log('Datos recibidos en el backend:', { userId, score });
  
    try {
      // Busca si ya existe un registro para el usuario
      let gameData = await GameData.findOne({ user: userId });
  
      if (!gameData) {
        console.log('Verificando si ya existe un registro antes de crear uno nuevo.');
        gameData = await GameData.findOne({ user: userId }); // Segunda verificación antes de crear
        if (!gameData) {
          console.log('Creando un nuevo registro para el usuario:', userId);
          gameData = new GameData({
            user: userId,
            best_score: score,
            last_score: score,
            trees_planted: score >= 250 ? 1 : 0,
          });
          await gameData.save();
          return res.status(201).json(gameData);
        }
      }
  
      // Actualizar el registro existente
      console.log('Actualizando el registro existente para el usuario:', userId);
      gameData.last_score = score;
      if (score > gameData.best_score) {
        gameData.best_score = score;
      }
      if (score >= 250) {
        gameData.trees_planted += 1;
      }
  
      await gameData.save();
      return res.status(200).json(gameData);
    } catch (error) {
      console.error('Error en el backend:', error);
      res.status(500).json({ error: 'Error al actualizar los datos del juego' });
    }
  });


  const PlantedTrees = require('../models/PlantedTrees');
  
  // Obtener estadísticas de árboles plantados y por plantar
  router.get('/trees-stats', async (req, res) => {
    try {
      const totalTreesToPlantData = await GameData.aggregate([
        { $group: { _id: null, total: { $sum: "$trees_planted" } } }
      ]);
      const totalTreesPlantedData = await PlantedTrees.aggregate([
        { $group: { _id: null, total: { $sum: "$trees_planted" } } }
      ]);
  
      const totalTreesToPlant = totalTreesToPlantData[0]?.total || 0;
      const totalTreesPlanted = totalTreesPlantedData[0]?.total || 0;
  
      const playersList = await GameData.find({ trees_planted: { $gt: 0 } })
        .populate('user', 'username')
        .select('user trees_planted');
  
      res.status(200).json({
        totalTreesToPlant,
        totalTreesPlanted,
        players: playersList,
      });
    } catch (error) {
      console.error('Error al obtener estadísticas de árboles:', error);
      res.status(500).json({ error: 'Error al obtener estadísticas de árboles.' });
    }
  });
  
  // Actualizar el número de árboles plantados manualmente
  router.post('/update-trees-planted', async (req, res) => {
    const { treesPlanted } = req.body;
  
    if (treesPlanted == null || treesPlanted <= 0) {
      return res.status(400).json({ error: "Cantidad inválida de árboles plantados." });
    }
  
    try {
      // Obtener los datos actuales
      const totalTreesToPlantData = await GameData.aggregate([
        { $group: { _id: null, total: { $sum: "$trees_planted" } } }
      ]);
      const totalTreesPlantedData = await PlantedTrees.aggregate([
        { $group: { _id: null, total: { $sum: "$trees_planted" } } }
      ]);
  
      const totalTreesToPlant = totalTreesToPlantData[0]?.total || 0;
      const totalTreesPlanted = totalTreesPlantedData[0]?.total || 0;
  
      const remainingTreesToPlant = totalTreesToPlant - totalTreesPlanted;
  
      // Validar si hay suficientes árboles por plantar
      if (treesPlanted > remainingTreesToPlant) {
        return res.status(400).json({ error: "La cantidad de árboles plantados excede los árboles por plantar disponibles." });
      }
  
      // Registrar la cantidad de árboles plantados en la tabla `PlantedTrees`
      const plantedEntry = new PlantedTrees({ trees_planted: treesPlanted });
      await plantedEntry.save();
  
      res.status(200).json({ message: "Árboles plantados actualizados correctamente." });
    } catch (error) {
      console.error('Error al actualizar árboles plantados:', error);
      res.status(500).json({ error: 'Error al actualizar árboles plantados.' });
    }
  });
  
  module.exports = router;
  