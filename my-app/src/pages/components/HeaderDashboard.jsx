import React, { useState } from "react";
import reactLogo from "../../assets/react.svg";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react"; // Importar ícono
import "../css/header.css";

const HeaderDashboard = ({ usuario, cart, setIsCartOpen }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0);

  const handleLogout = () => {
    fetch("http://127.0.0.1:8000/api/cerrar-sesion/", {
      method: "POST",
      credentials: "include",
    }).then(() => {
      window.location.href = "/login";
    });
  };

  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-3">
      <div className="flex items-center space-x-2">
        <Link to="/">
          <img src={reactLogo} alt="Logo" className="w-10 h-10" />
        </Link>
        <h1 className="text-xl font-bold">Dashboard</h1>
      </div>

      <div className="hidden md:block flex-1 mx-6">
        {/* Search bar can be re-enabled if needed */}
      </div>

      <div className="hidden md:flex items-center space-x-4">
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative p-2 rounded-full hover:bg-gray-100"
        >
          <ShoppingCart className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Cerrar Sesión
        </button>
        <span className="text-gray-600">👤 {usuario?.nombre}</span>
      </div>

      <button
        className="md:hidden text-2xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center py-4 space-y-3 md:hidden">
            <button onClick={() => {setIsCartOpen(true); setMenuOpen(false);}} className="text-lg">Mi Carrito ({totalItems})</button>
            <button onClick={handleLogout}>Cerrar Sesión</button>
            <span>👤 {usuario?.nombre}</span>
        </div>
      )}
    </header>
  );
};

export default HeaderDashboard;
