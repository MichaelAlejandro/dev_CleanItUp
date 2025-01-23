const express = require('express');
const path = require('path');
const multer = require('multer');
const Character = require('../models/Character');

const router = express.Router();

// Configuración de Multer para subir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../client/public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));// Crear un nombre único para la imagen
  },
});

const upload = multer({ storage });

// ==================================================
// ===============   READ (GET)   ===================
// ==================================================
router.get('/', async (req, res) => {
  try {
    const characters = await Character.find();
    res.json(characters);
  } catch (err) {
    res.status(500).json({
      message: 'Error al obtener los personajes',
      error: err.message,
    });
  }
});

// ==================================================
// ==============   CREATE (POST)   =================
// ==================================================
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !description || !image) {
      return res
        .status(400)
        .json({ message: 'Todos los campos son obligatorios' });
    }

    const newCharacter = new Character({ name, description, image });
    await newCharacter.save();
    res.status(201).json(newCharacter);
  } catch (err) {
    res.status(500).json({
      message: 'Error al crear personaje',
      error: err.message,
    });
  }
});

// ==================================================
// =============   UPDATE (PUT)   ===================
// ==================================================
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Preparamos un objeto con los campos que se actualizarán
    const updatedFields = {
      name,
      description,
    };

    // Si se sube una nueva imagen, la adjuntamos
    if (req.file) {
      updatedFields.image = req.file.filename;
    }

    // Realizamos la búsqueda y actualización
    const updatedCharacter = await Character.findByIdAndUpdate(
      id,
      updatedFields,
      { new: true } // Retorna el personaje actualizado
    );

    if (!updatedCharacter) {
      return res.status(404).json({ message: 'Personaje no encontrado' });
    }

    res.json(updatedCharacter);
  } catch (err) {
    res.status(500).json({
      message: 'Error al actualizar el personaje',
      error: err.message,
    });
  }
});

// ==================================================
// =============   DELETE (DELETE)   ================
// ==================================================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Character.findByIdAndDelete(id);
    res.sendStatus(204); // Eliminado correctamente
  } catch (err) {
    res.status(500).json({
      message: 'Error al eliminar personaje',
      error: err.message,
    });
  }
});

// ==================================================
// ==========   SET MAIN CHARACTER (PUT)   ==========
// ==================================================
router.put('/:id/set-main', async (req, res) => {
  try {
    const { id } = req.params;
 
    await Character.updateMany({}, { isMain: false });// Establecer isMain = false en todos

    // Establecer isMain = true para el seleccionado
    const mainCharacter = await Character.findByIdAndUpdate(
      id,
      { isMain: true },
      { new: true }
    );
    res.json(mainCharacter);
  } catch (err) {
    res.status(500).json({
      message: 'Error al establecer personaje principal',
      error: err.message,
    });
  }
});



// ==================================================
// =========== GET MAIN CHARACTER ===================
// ==================================================
router.get('/main', async (req, res) => {
    try {
      const mainCharacter = await Character.findOne({ isMain: true });
      if (!mainCharacter) {
        return res.status(404).json({ message: 'No hay un personaje principal configurado' });
      }
      res.json(mainCharacter);
    } catch (err) {
      res.status(500).json({
        message: 'Error al obtener el personaje principal',
        error: err.message,
      });
    }
  });
  

module.exports = router;