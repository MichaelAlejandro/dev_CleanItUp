import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider,useAuth } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Index from './components/Index';
import AboutUs from './components/AboutUs';
import Ranking from './components/Ranking';
import Plantations from './components/Plantations';
import KnowMore from './components/KnowMore';
import Login from './components/Login';
import Register from './components/Register';
import Game from './components/Game';
import Characters from './components/Characters';


// Componente para rutas protegidas
const PrivateRoute = ({ children }) => {
    const { token } = useAuth();
    return token ? children : <Navigate to="/login" />;
};

function App() {

  return (
      <AuthProvider>
          <Router>
              <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/aboutus" element={<PrivateRoute><AboutUs /></PrivateRoute>} />
                  <Route path="/ranking" element={<PrivateRoute><Ranking /></PrivateRoute>} />
                  <Route path="/plantations" element={<PrivateRoute><Plantations /></PrivateRoute>} />
                  <Route path="/knowmore" element={<PrivateRoute><KnowMore /></PrivateRoute>} />
                  <Route path="/game" element={<PrivateRoute><Game/></PrivateRoute>} />
                  <Route path="/characters" element={<PrivateRoute><Characters/></PrivateRoute>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
              </Routes>
          </Router>
      </AuthProvider>
  );
}


export default App;
