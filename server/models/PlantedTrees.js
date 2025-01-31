const mongoose = require('mongoose');

const PlantedTreesSchema = new mongoose.Schema({
  trees_planted: { type: Number, required: true }, // Cantidad de árboles plantados
  date: { type: Date, default: Date.now }, // Fecha en que se plantaron
});

module.exports = mongoose.model('PlantedTrees', PlantedTreesSchema);
