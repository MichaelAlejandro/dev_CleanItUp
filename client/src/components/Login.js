import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      login(data.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D3F1DF] to-[#85A98F] flex items-center justify-center">
      <div className="container">
        <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8">
          <h2 className="text-3xl font-bold text-center text-[#47663B] mb-6">
            Iniciar Sesión
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-500 text-center">{error}</p>}
            
            <div className="relative">
              <i className="bi bi-person-fill absolute left-3 top-1/2 transform -translate-y-1/2 text-black-400"></i>
              <input 
                type="text" 
                placeholder="Nombre de usuario" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div className="relative">
              <i className="bi bi-lock-fill absolute left-3 top-1/2 transform -translate-y-1/2 text-black-400"></i>
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#47663B]"
              >
                <i className={`bi ${showPassword ? 'bi-eye-fill' : 'bi-eye-slash-fill'}`}></i>
              </button>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#85A98F] to-[#D3F1DF] text-white py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Iniciar Sesión
            </button>
    
            <div className="text-center">
              <a href="/register" className="text-sm text-[#5A6C57] hover:underline">
                ¿No tienes cuenta? Registrarse
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
