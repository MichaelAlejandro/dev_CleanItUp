const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/auth-system');
    console.log('MongoDB Conexión exitosa a la base de datos.');
  } catch (error) {
    console.error('MongoDB Error en la conexión (base de datos):', error);
    process.exit(1);
  }
};

module.exports = connectDB;