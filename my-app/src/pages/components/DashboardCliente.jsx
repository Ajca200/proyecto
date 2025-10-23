import { useState } from "react";

// Import child components
import ComprasCliente from "./ComprasCliente";
import CarritoCompra from "./CarritoClientes";
import HistorialCompras from "./dashboard/HistorialCompras";
import UltimaCompra from "./dashboard/UltimaCompra";
import GestionDirecciones from "./dashboard/GestionDirecciones";
import PerfilUsuario from "./dashboard/PerfilUsuario";

const navItems = [
  { id: "comprar", label: "Comprar" },
  { id: "historial", label: "Historial" },
  { id: "ultima", label: "Última compra" },
  { id: "direcciones", label: "Direcciones" },
  { id: "perfil", label: "Perfil" },
  { id: "soporte", label: "Soporte" },
];

const DashboardCliente = ({ cart, setCart, isCartOpen, setIsCartOpen }) => {
  const [activeTab, setActiveTab] = useState("comprar");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "comprar":
        return <ComprasCliente cart={cart} setCart={setCart} isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />;
      case "historial":
        return <HistorialCompras />;
      case "ultima":
        return <UltimaCompra />;
      case "direcciones":
        return <GestionDirecciones />;
      case "perfil":
        return <PerfilUsuario />;
      case "soporte":
        return <div>Soporte</div>;
      default:
        return <ComprasCliente cart={cart} setCart={setCart} isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden md:block w-64 bg-white shadow p-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-6">Mi Cuenta</h2>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`text-left px-3 py-2 rounded-md transition ${
                activeTab === item.id ? "bg-blue-500 text-white shadow" : "hover:bg-gray-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6">
        {renderActiveTab()}
      </main>
    </div>
  );
};

export default DashboardCliente;