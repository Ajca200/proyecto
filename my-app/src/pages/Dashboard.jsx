import { useState, useEffect } from "react";
import HeaderDashboard from "./components/HeaderDashboard";
import getCookie from "./components/get_cookie";

// 🔹 Dashboard del Cliente
const DashboardCliente = () => {
  const [activeTab, setActiveTab] = useState("perfil");

  return (
    <div className="flex flex-1">
      {/* Sidebar responsive */}
      <aside className="hidden md:block w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-6">Mi Cuenta</h2>
        <nav className="flex flex-col space-y-3">
          {[
            { id: "perfil", label: "Actualizar Datos" },
            { id: "carrito", label: "Mi Carrito" },
            { id: "historial", label: "Compras Mensuales" },
            { id: "ultima", label: "Última Compra" },
            { id: "direcciones", label: "Direcciones" },
            { id: "soporte", label: "Soporte" },
          ].map((item) => (
            <button
              key={item.id}
              className={`text-left p-2 rounded ${
                activeTab === item.id
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-6">
        {activeTab === "perfil" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Actualizar Datos</h2>
            <form className="space-y-4 max-w-md">
              <input
                type="text"
                placeholder="Nombre"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Apellido"
                className="w-full p-2 border rounded"
              />
              <input
                type="password"
                placeholder="Nueva Contraseña"
                className="w-full p-2 border rounded"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Guardar Cambios
              </button>
            </form>
          </div>
        )}

        {activeTab === "carrito" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Mi Carrito</h2>
            <p>Aquí se mostrarán los productos agregados al carrito.</p>
          </div>
        )}

        {activeTab === "historial" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Compras Mensuales</h2>
            <p>Aquí el cliente podrá ver cuántos productos compró cada mes.</p>
          </div>
        )}

        {activeTab === "ultima" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Estado de la Última Compra
            </h2>
            <p>Aquí se mostrará el estado del pedido más reciente.</p>
          </div>
        )}

        {activeTab === "direcciones" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Direcciones Guardadas</h2>
            <form className="space-y-4 max-w-md">
              <input
                type="text"
                placeholder="Dirección de Hogar"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Ciudad"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Código Postal"
                className="w-full p-2 border rounded"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Agregar Dirección
              </button>
            </form>
          </div>
        )}

        {activeTab === "soporte" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Soporte</h2>
            <p>¿Necesitas ayuda? Contáctanos a través del chat o correo.</p>
          </div>
        )}
      </main>
    </div>
  );
};

// 🔹 Dashboard del Admin (versión básica)
const DashboardAdmin = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Panel de Administración</h2>
      <p>
        Bienvenido administrador 👑. Aquí podrás gestionar productos, usuarios,
        pedidos y mucho más.
      </p>
    </div>
  );
};

// 🔹 Dashboard principal con validación de sesión
const Dashboard = () => {
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
  fetch("http://127.0.0.1:8000/api/estado-sesion/", {
    method: "GET",
    credentials: "include",
  })
    .then((res) => {
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      console.log(data);
      if (data.autenticado) {
        setUsuario(data.usuario);
        setRol(data.rol);
      } else {
        // window.location.href = "/login";
      }
      setCargando(false);
    })
    .catch((err) => {
      console.error("Error validando sesión:", err);
      setCargando(false);
    });
}, []);

  if (cargando) {
    return <p className="p-6">Cargando...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderDashboard usuario={usuario} />
      {rol === "admin" ? <DashboardAdmin /> : <DashboardCliente />}
    </div>
  );
};

export default Dashboard;
