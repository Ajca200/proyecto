import { useState, useEffect } from "react";
import HeaderDashboard from "./components/HeaderDashboard";
import FetchPerfil from "./components/verificacion_sesion";
import DashboardCliente from "./components/DashboardCliente";

const DashboardAdmin = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Panel de Administración</h2>
      <p>Bienvenido administrador 👑. Aquí podrás gestionar productos, usuarios, pedidos y mucho más.</p>
    </div>
  );
};

const Dashboard = () => {
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const verificarSesion = async () => {
      const PerfilData = await FetchPerfil();
      if (PerfilData) {
        setUsuario(PerfilData);
        setRol(PerfilData.rol);
      }
      setCargando(false);
    };

    const fetchCart = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/carrito/', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          });
          if (response.ok) {
            const data = await response.json();
            setCart(data.items || []);
          } else {
            console.error('Error al cargar el carrito');
          }
        } catch (error) {
          console.error('Error de red al cargar el carrito', error);
        }
      };

    verificarSesion();
    fetchCart();
  }, []);

  if (cargando) {
    return <p className="p-6">Cargando...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderDashboard usuario={usuario} cart={cart} setIsCartOpen={setIsCartOpen} />
      {rol === "admin" ? <DashboardAdmin /> : <DashboardCliente cart={cart} setCart={setCart} isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />}
    </div>
  );
};

export default Dashboard;
