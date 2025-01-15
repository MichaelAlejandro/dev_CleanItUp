import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Index from './components/Index';
import AboutUs from './components/AboutUs';
import Ranking from './components/Ranking';
import Plantations from './components/Plantations';
import KnowMore from './components/KnowMore';
import Game from './components/Game';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/plantations" element={<Plantations />} />
          <Route path="/knowmore" element={<KnowMore />} />
          <Route path="/game" element={<Game />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;