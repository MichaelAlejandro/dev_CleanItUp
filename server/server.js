const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db'); 
const characterRoutes = require('./routes/characters'); 
const authRoutes = require('./routes/auth');

const app = express();

connectDB();


app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
