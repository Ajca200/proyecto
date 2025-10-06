import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import HeaderDashboard from "./components/HeaderDashboard";
import getCookie from "./components/get_cookie";
import FetchPerfil from "./components/verificacion_sesion";
import DashboardCliente from "./components/DashboardCliente";

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
    const verificarSesion = async () => {
      const PerfilData = await FetchPerfil();

      if (PerfilData) {
        setUsuario(PerfilData);
        setRol(PerfilData.rol);
      }

      setCargando(false);
    }
    verificarSesion();
}, []);

  if (cargando) {
    return <p className="p-6">Cargando...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/*<HeaderDashboard usuario={usuario} />*/}
      {rol === "admin" ? <DashboardAdmin /> : <DashboardCliente />}
    </div>
  );
};

export default Dashboard;
