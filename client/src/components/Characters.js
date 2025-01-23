import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import '../styles/Characters.css';

const Characters = () => {
  const [characters, setCharacters] = useState([]);
  const [newCharacter, setNewCharacter] = useState({ name: '', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [mainCharacter, setMainCharacter] = useState(null);
  const [error, setError] = useState(null);

  // Estados para edición
  const [editCharacterId, setEditCharacterId] = useState(null);
  const [editCharacterData, setEditCharacterData] = useState({
    name: '',
    description: '',
  });
  const [editImageFile, setEditImageFile] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCharacters();
  }, []);

  // ========================
  //        READ
  // ========================
  const fetchCharacters = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/characters', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('No se pudieron obtener los personajes');
      }

      const data = await response.json();
      setCharacters(data);

      // Personaje principal, si existe
      const main = data.find((char) => char.isMain);
      setMainCharacter(main);
    } catch (err) {
      setError(err.message);
    }
  };

  // ========================
  //       CREATE
  // ========================
  const handleCreate = async () => {
    if (!newCharacter.name || !newCharacter.description || !imageFile) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', newCharacter.name);
      formData.append('description', newCharacter.description);
      formData.append('image', imageFile); // Agregar el archivo de imagen

      const response = await fetch('http://localhost:5000/api/characters', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // Token para autenticación
        },
        body: formData, // Enviar datos como FormData
      });

      if (!response.ok) {
        throw new Error('Error al crear el personaje');
      }

      // Limpiamos los campos
      setNewCharacter({ name: '', description: '' });
      setImageFile(null);
      // Volvemos a cargar la lista
      fetchCharacters();
    } catch (err) {
      setError(err.message);
    }
  };

  // ========================
  //       UPDATE
  // ========================
  const handleEditClick = (char) => {
    setEditCharacterId(char._id);
    setEditCharacterData({ name: char.name, description: char.description });
    setEditImageFile(null);
  };

  const handleCancelEdit = () => {
    setEditCharacterId(null);
    setEditCharacterData({ name: '', description: '' });
    setEditImageFile(null);
  };

  const handleUpdate = async () => {
    if (!editCharacterData.name || !editCharacterData.description) {
      setError('Todos los campos son obligatorios para actualizar.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', editCharacterData.name);
      formData.append('description', editCharacterData.description);
      if (editImageFile) {
        formData.append('image', editImageFile);
      }

      const response = await fetch(`http://localhost:5000/api/characters/${editCharacterId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el personaje');
      }

      // Limpiamos
      setEditCharacterId(null);
      setEditCharacterData({ name: '', description: '' });
      setEditImageFile(null);

      // Refrescamos la lista
      fetchCharacters();
    } catch (err) {
      setError(err.message);
    }
  };

  // ========================
  //       DELETE
  // ========================
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/characters/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el personaje');
      }

      fetchCharacters();
    } catch (err) {
      setError(err.message);
    }
  };

  // ========================
  //     SET MAIN
  // ========================
  const handleSetMain = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/characters/${id}/set-main`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al establecer el personaje principal');
      }

      fetchCharacters();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="characters-page">
      <Navbar />
      <div className="characters-container">
        <h1 className="characters-title">Gestión de Personajes</h1>

        {error && <p className="error-message">{error}</p>}

        {/* FORMULARIO PARA CREAR */}
        <div className="create-form">
          <h2>Añadir Personaje</h2>
          <input
            type="text"
            placeholder="Nombre"
            value={newCharacter.name}
            onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
          />
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          <textarea
            placeholder="Descripción"
            value={newCharacter.description}
            onChange={(e) => setNewCharacter({ ...newCharacter, description: e.target.value })}
          />
          <button onClick={handleCreate} className="btn-primary">
            Crear
          </button>
        </div>

        {/* LISTADO DE PERSONAJES */}
        <div className="characters-list">
          <h2>Lista de Personajes</h2>
          {characters.map((char) => (
            <div key={char._id} className="character-card">
              {editCharacterId === char._id ? (
                <>
                  <input
                    type="text"
                    value={editCharacterData.name}
                    onChange={(e) =>
                      setEditCharacterData({ ...editCharacterData, name: e.target.value })
                    }
                  />
                  <input
                    type="file"
                    onChange={(e) => setEditImageFile(e.target.files[0])}
                  />
                  <textarea
                    value={editCharacterData.description}
                    onChange={(e) =>
                      setEditCharacterData({
                        ...editCharacterData,
                        description: e.target.value,
                      })
                    }
                  />
                  <button onClick={handleUpdate} className="btn btn-success">
                    Guardar
                  </button>
                  <button onClick={handleCancelEdit} className="btn btn-secondary">
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <img
                    src={`/uploads/${char.image}`}
                    alt={char.name}
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />

                  <h3>{char.name}</h3>
                  <p>{char.description}</p>
                  <button onClick={() => handleEditClick(char)} className="btn btn-warning">
                    Editar
                  </button>
                </>
              )}

              <button onClick={() => handleDelete(char._id)} className="btn btn-danger">
                Eliminar
              </button>
              <button onClick={() => handleSetMain(char._id)} className="btn btn-success">
                {char.isMain ? 'Personaje Principal' : 'Establecer como Principal'}
              </button>
            </div>
          ))}
        </div>

        {/* MOSTRAR PERSONAJE PRINCIPAL */}
        {mainCharacter && (
          <div className="main-character">
            <h2>Personaje Principal</h2>
            <img
              src={`/uploads/${mainCharacter.image}`}
              alt={mainCharacter.name}
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />

            <h3>{mainCharacter.name}</h3>
            <p>{mainCharacter.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Characters;