require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const characterRoutes = require('./routes/characters');
const authRoutes = require('./routes/auth');
const gameDataRoutes = require('./routes/gameData');

const app = express();

connectDB();
console.log('JWT_SECRET:', process.env.JWT_SECRET);

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/game-data', gameDataRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});