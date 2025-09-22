import React, { useState } from "react";
import reactLogo from "../../assets/react.svg";
import { Link } from "react-router-dom";
import "../css/header.css";

const HeaderDashboard = ({ usuario }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleReset = (e) => {
    e.preventDefault();
    const searchInput = document.getElementById("barra-busqueda");
    if (searchInput) {
      searchInput.value = "";
    }
  };

  const handleLogout = () => {
    fetch("http://127.0.0.1:8000/api/logout/", {
      method: "POST",
      credentials: "include",
    }).then(() => {
      window.location.href = "/login";
    });
  };

  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-3">
      {/* Logo + Título */}
      <div className="flex items-center space-x-2">
        <Link to="/">
          <img src={reactLogo} alt="Logo" className="w-10 h-10" />
        </Link>
        <h1 className="text-xl font-bold">Dashboard</h1>
      </div>

      {/* Barra de búsqueda */}
      <div className="hidden md:block flex-1 mx-6">
        <form
          action="#"
          method="post"
          onSubmit={(e) => e.preventDefault()}
          className="relative"
        >
          <input
            type="search"
            id="barra-busqueda"
            placeholder="Buscar productos..."
            className="w-full border rounded px-4 py-2"
          />
          <button
            type="button"
            onClick={handleReset}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xl"
          >
            &times;
          </button>
        </form>
      </div>

      {/* Botones */}
      <div className="hidden md:flex items-center space-x-4">
        <Link to="/tienda">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Ir a Tienda
          </button>
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Cerrar Sesión
        </button>
        <span className="text-gray-600">👤 {usuario?.nombre}</span>
      </div>

      {/* Botón menú móvil */}
      <button
        className="md:hidden text-2xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center py-4 space-y-3 md:hidden">
          <Link to="/tienda" onClick={() => setMenuOpen(false)}>
            Ir a Tienda
          </Link>
          <button onClick={handleLogout}>Cerrar Sesión</button>
          <span>👤 {usuario?.nombre}</span>
        </div>
      )}
    </header>
  );
};

export default HeaderDashboard;
