import { Trash2, ShoppingCart, MapPin, Edit, PlusCircle, Search } from "lucide-react";
import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import ComprasCliente from "./ComprasCliente";
import CarritoCompra from "./CarritoClientes";

// --- Componente para Historial de Compras ---
const HistorialCompras = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const historial = [
    { id: 'A001', fecha: '2024-07-15', total: 125.50, estado: 'Entregado' },
    { id: 'A002', fecha: '2024-07-20', total: 89.99, estado: 'Entregado' },
    { id: 'A003', fecha: '2024-08-01', total: 250.00, estado: 'En camino' },
  ];

  // Lógica de filtro (actualmente simulada)
  const filteredHistorial = historial.filter(item => {
    if (!startDate || !endDate) return true;
    const itemDate = new Date(item.fecha);
    return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
  });

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Historial de Compras</h2>
      
      {/* Filtro de Fechas */}
      <div className="bg-white shadow rounded-lg p-4 mb-6 flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <button className="self-end px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2">
          <Search size={18} />
          <span>Buscar</span>
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
              <th className="px-5 py-3">Pedido ID</th>
              <th className="px-5 py-3">Fecha</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistorial.map(item => (
              <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-5 py-4 text-sm">{item.id}</td>
                <td className="px-5 py-4 text-sm">{item.fecha}</td>
                <td className="px-5 py-4 text-sm">${item.total.toFixed(2)}</td>
                <td className="px-5 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    item.estado === 'Entregado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Componente para Última Compra ---
const UltimaCompra = () => {
  const ultima = { id: 'A003', fecha: '2024-08-01', total: 250.00, estado: 'En camino' };
  const estados = ['Procesando', 'En camino', 'Entregado'];
  const estadoActualIndex = estados.indexOf(ultima.estado);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Última Compra</h2>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-gray-500">Pedido ID: <span className="font-bold text-gray-800">{ultima.id}</span></p>
            <p className="text-gray-500">Fecha: <span className="font-bold text-gray-800">{ultima.fecha}</span></p>
            <p className="text-gray-500">Total: <span className="font-bold text-2xl text-blue-600">${ultima.total.toFixed(2)}</span></p>
          </div>
          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
            {ultima.estado}
          </span>
        </div>
        {/* Línea de tiempo del estado */}
        <div className="mt-8">
          <div className="flex justify-between">
            {estados.map((estado, index) => (
              <div key={estado} className="text-center flex-1">
                <div className={`mx-auto w-6 h-6 rounded-full flex items-center justify-center ${index <= estadoActualIndex ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                  {index < estadoActualIndex ? '✓' : index + 1}
                </div>
                <p className={`mt-2 text-sm ${index <= estadoActualIndex ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>{estado}</p>
              </div>
            ))}
          </div>
          <div className="relative mt-[-20px] mx-auto w-11/12">
            <div className="h-1 bg-gray-300 rounded-full"></div>
            <div className="absolute top-0 h-1 bg-blue-500 rounded-full" style={{ width: `${(estadoActualIndex / (estados.length - 1)) * 100}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Componente para Gestión de Direcciones (Corregido) ---
const GestionDirecciones = () => {
    // 1. Estados iniciales de las direcciones
    const [direcciones, setDirecciones] = useState([
        { id: 1, alias: 'Casa', calle: 'Av. Siempre Viva 742', ciudad: 'Springfield', cp: '12345' },
        { id: 2, alias: 'Oficina', calle: 'Calle Falsa 123', ciudad: 'Shelbyville', cp: '54321' },
    ]);

    // 2. Estados del Modal y Dirección en edición/creación
    const [showModal, setShowModal] = useState(false);
    // Cambié el tipo de estado inicial para usar un objeto o null
    const [direccionActual, setDireccionActual] = useState(null); 
    
    // 3. Estados para los datos de Ubicación (API)
    // Usaremos un estado para todas las ubicaciones y los otros para las listas filtradas
    const [todasLasUbicaciones, setTodasLasUbicaciones] = useState([]);
    const [parroquiasFiltradas, setParroquiasFiltradas] = useState([]); // Parroquias a mostrar
    const [municipiosFiltrados, setMunicipiosFiltrados] = useState([]); // Municipios a mostrar
    const [estadosFiltrados, setEstadosFiltrados] = useState([]); // Estados a mostrar

    // 4. Estado para el Formulario (valores controlados)
    const [formData, setFormData] = useState({
        alias: '',
        calle: '',
        ciudad: '',
        cp: '',
        parroquia_id: '',
        municipio_id: '',
        estado_id: '',
    });

    // --- Efecto: Cargar datos de la API al montar el componente ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/direcciones/', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    setTodasLasUbicaciones(data || []);
                    // Inicializamos las parroquias a mostrar con TODAS
                    setParroquiasFiltradas(data || []); 

                    // Lógica para extraer Municipios y Estados únicos
                    const municipiosUnicos = Array.from(new Set(data.map(item => item.municipio_id)))
                        .map(id => data.find(item => item.municipio_id === id));

                    const estadosUnicos = Array.from(new Set(data.map(item => item.estado_id)))
                        .map(id => data.find(item => item.estado_id === id));
                        
                    setMunicipiosFiltrados(municipiosUnicos);
                    setEstadosFiltrados(estadosUnicos);

                } else {
                    console.error('Error al cargar ubicaciones');
                }
            } catch (error) {
                console.error('Error de red al cargar ubicaciones', error);
            }
        };
        fetchData();
    }, []);
    
    // --- Lógica de Manejo del Modal ---
    const handleOpenModal = (dir = null) => {
        // Establecer la dirección actual (para edición) o null (para nueva)
        setDireccionActual(dir); 

        // Inicializar el formulario:
        if (dir) {
            // Edición: Rellenar con los datos de la dirección
            setFormData({
                ...dir, // Asume que 'dir' tiene las claves del formulario (alias, calle, etc.)
                // También deberías buscar los IDs de ubicacion si los maneja la API
            });
            // Lógica para filtrar dropdowns si aplica la edición (puede ser compleja sin más datos)
        } else {
            // Nueva dirección: Limpiar el formulario y establecer valores iniciales
            setFormData({
                alias: '',
                calle: '',
                ciudad: '',
                cp: '',
                parroquia_id: '',
                municipio_id: '',
                estado_id: '',
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setDireccionActual(null);
    };
    
    // --- Lógica del Formulario ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    // Función para manejar el cambio en el selector de Estado
    const handleEstadoChange = (e) => {
        const estadoId = e.target.value;
        // 1. Actualizar el estado del formulario
        setFormData(prev => ({ 
            ...prev, 
            estado_id: estadoId, 
            municipio_id: '', // Resetear municipio y parroquia
            parroquia_id: '' 
        }));
        
        // 2. Filtrar los municipios basados en el estado seleccionado
        const municipiosDelEstado = Array.from(new Set(todasLasUbicaciones
            .filter(item => item.estado_id === parseInt(estadoId)) // Asegurar el tipo
            .map(item => item.municipio_id)))
            .map(id => todasLasUbicaciones.find(item => item.municipio_id === id));
            
        setMunicipiosFiltrados(municipiosDelEstado);
        setParroquiasFiltradas([]); // No mostrar parroquias hasta seleccionar municipio
    };

    // Función para manejar el cambio en el selector de Municipio
    const handleMunicipioChange = (e) => {
        const municipioId = e.target.value;
        // 1. Actualizar el estado del formulario
        setFormData(prev => ({ 
            ...prev, 
            municipio_id: municipioId, 
            parroquia_id: '' // Resetear parroquia
        }));
        
        // 2. Filtrar las parroquias basadas en el municipio seleccionado
        const parroquiasDelMunicipio = todasLasUbicaciones
            .filter(item => item.municipio_id === parseInt(municipioId)); // Asegurar el tipo
            
        setParroquiasFiltradas(parroquiasDelMunicipio);
    };

    // Función para guardar (crear o editar)
    const handleSave = (e) => {
        e.preventDefault();
        console.log("Datos a guardar:", formData);

        // Aquí iría la lógica de API (POST para nueva, PUT/PATCH para edición)
        
        // Simulación de guardado
        if (direccionActual) {
            // Lógica de edición
        } else {
            // Lógica de creación (ejemplo: simular ID)
        }
        
        handleCloseModal();
    };

    // --- Renderizado ---
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Mis Direcciones</h2>
                {/* Cambié el valor pasado a null para indicar "Nueva Dirección" */}
                <button onClick={() => handleOpenModal(null)} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                    {/* <PlusCircle size={20} /> */}
                    <span>Agregar Dirección</span>
                </button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                {direcciones.map(dir => (
                    <div key={dir.id} className="bg-white shadow rounded-lg p-5 flex justify-between items-start">
                        <div>
                            {/* <p className="font-bold text-lg flex items-center gap-2"><MapPin size={20} className="text-gray-400" /> {dir.alias}</p> */}
                            <p className="font-bold text-lg flex items-center gap-2"> {dir.alias}</p>
                            <p className="text-gray-600 mt-2">{dir.calle}, {dir.ciudad}, C.P. {dir.cp}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleOpenModal(dir)} className="p-2 text-gray-500 hover:text-blue-600"> {/* <Edit size={18} /> */}</button>
                            <button className="p-2 text-gray-500 hover:text-red-600"> {/* <Trash2 size={18} /> */}</button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <Modal onClose={handleCloseModal} className="max-w-lg p-[20px]">
                    {/* Usamos direccionActual para determinar si es edición o nueva */}
                    <h3 className="text-2xl font-bold mb-4">{direccionActual ? 'Editar Dirección' : 'Nueva Dirección'}</h3>
                    
                    <form onSubmit={handleSave} className="space-y-4 p-4" >
                        {/* Campos de texto normales */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Alias</label>
                            <input
                                type="text"
                                name="alias"
                                value={formData.alias}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                            />
                        </div>
                        
                        {/* SELECT ESTADO */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Estado</label>
                            <select
                                name="estado_id"
                                value={formData.estado_id}
                                onChange={handleEstadoChange}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                            >
                                <option value="">Seleccione un Estado</option>
                                {estadosFiltrados.map(estado => (
                                    <option key={estado.estado_id} value={estado.estado_id}>{estado.estado}</option>
                                ))}
                            </select>
                        </div>
                        {/* SELECT MUNICIPIO */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Municipio</label>
                            <select
                                name="municipio_id"
                                value={formData.municipio_id}
                                onChange={handleMunicipioChange}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                                disabled={!formData.estado_id} // Deshabilitado si no hay estado
                            >
                                <option value="">Seleccione un Municipio</option>
                                {municipiosFiltrados.map(municipio => (
                                    // Asumo que el objeto municipio en municipiosFiltrados tiene la key 'municipio_id' y 'municipio'
                                    <option key={municipio.municipio_id} value={municipio.municipio_id}>{municipio.municipio}</option>
                                ))}
                            </select>
                        </div>
                         {/* SELECT PARROQUIA */}
                         <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Parroquia</label>
                            <select
                                name="parroquia_id"
                                value={formData.parroquia_id}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                                disabled={!formData.municipio_id} // Deshabilitado si no hay municipio
                            >
                                <option value="">Seleccione una Parroquia</option>
                                {parroquiasFiltradas.map(parroquia => (
                                    // Asumo que el objeto parroquia en parroquiasFiltradas tiene la key 'parroquia_id' y 'parroquia'
                                    <option key={parroquia.parroquia_id} value={parroquia.parroquia_id}>{parroquia.parroquia}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Direccion Completa</label>
                            <textarea name="direccion_completa" placeholder="Calle XX, Casa 20, Sector Nueva Esparta" className="w-full px-3 py-2 border rounded-lg" required></textarea>
                        </div>
                        
                        <div className="flex justify-end gap-4 mt-6">
                            <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 rounded-lg">Cancelar</button>
                            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Guardar</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};
// --- Componente para Perfil de Usuario ---
const PerfilUsuario = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    console.log("Perfil guardado");
    setShowEditModal(false);
  };

  const handleDeleteAccount = () => {
    console.log("Cuenta eliminada");
    setShowDeleteConfirm(false);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Mi Perfil</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columna de acciones */}
        <div className="md:col-span-1 flex flex-col gap-6">
          <div className="bg-white shadow rounded-lg p-5">
            <h3 className="font-bold text-lg mb-3">Editar Perfil</h3>
            <p className="text-sm text-gray-600 mb-4">Actualiza tu nombre, email o información de contacto.</p>
            <button onClick={() => setShowEditModal(true)} className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">Editar Datos</button>
          </div>
          <div className="bg-white shadow rounded-lg p-5">
            <h3 className="font-bold text-lg mb-3">Eliminar Cuenta</h3>
            <p className="text-sm text-gray-600 mb-4">Esta acción es permanente y no se puede deshacer.</p>
            <button onClick={() => setShowDeleteConfirm(true)} className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Eliminar Mi Cuenta</button>
          </div>
        </div>

        {/* Columna de información (simulada) */}
        <div className="md:col-span-2 bg-white shadow rounded-lg p-5">
          <h3 className="font-bold text-lg mb-4">Información Actual</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Nombre</p>
              <p className="font-semibold">Juan Pérez</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold">juan.perez@email.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Editar Perfil */}
      {showEditModal && (
        <Modal onClose={() => setShowEditModal(false)}>
          <h3 className="text-2xl font-bold mb-4">Editar Perfil</h3>
          <form onSubmit={handleSaveProfile}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Nombre</label>
              <input type="text" defaultValue="Juan Pérez" className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Email</label>
              <input type="email" defaultValue="juan.perez@email.com" className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Guardar Cambios</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal de Confirmación para Eliminar Cuenta */}
      {showDeleteConfirm && (
        <Modal onClose={() => setShowDeleteConfirm(false)}>
          <h3 className="text-2xl font-bold mb-4">¿Estás seguro?</h3>
          <p className="text-gray-600 mb-6">Estás a punto de eliminar tu cuenta permanentemente. Todos tus datos, historial de compras y direcciones se perderán.</p>
          <div className="flex justify-end gap-4">
            <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancelar</button>
            <button onClick={handleDeleteAccount} className="px-4 py-2 bg-red-600 text-white rounded-lg">Sí, Eliminar Cuenta</button>
          </div>
        </Modal>
      )}
    </div>
  );
};


/* ---- Componente Principal ---- */
const DashboardCliente = () => {
  const [activeTab, setActiveTab] = useState("comprar");
  const [cart, setCart] = useState([]);

  useEffect(() => {
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
    fetchCart();
  }, []);

  const totalItems = cart.reduce((s, c) => s + c.cantidad, 0);
  const totalPrice = cart.reduce((s, c) => s + c.cantidad * c.precio, 0);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="hidden md:block w-64 bg-white shadow p-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-6">Mi Cuenta</h2>
        <nav className="flex flex-col gap-2">
          {[
            { id: "comprar", label: "Comprar" },
            { id: "carrito", label: "Mi Carrito" },
            { id: "historial", label: "Historial" },
            { id: "ultima", label: "Última compra" },
            { id: "direcciones", label: "Direcciones" },
            { id: "perfil", label: "Perfil" },
            { id: "soporte", label: "Soporte" },
          ].map((it) => (
            <button
              key={it.id}
              onClick={() => setActiveTab(it.id)}
              className={`text-left px-3 py-2 rounded-md transition ${
                activeTab === it.id ? "bg-blue-500 text-white shadow" : "hover:bg-gray-100"
              }`}
            >
              {it.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6 relative">
        {activeTab === "comprar" && <ComprasCliente cart={cart} setCart={setCart} />}
        {activeTab === "carrito" && <CarritoCompra cart={cart} setCart={setCart} totalItems={totalItems} totalPrice={totalPrice} />}
        {activeTab === "historial" && <HistorialCompras />}
        {activeTab === "ultima" && <UltimaCompra />}
        {activeTab === "direcciones" && <GestionDirecciones />}
        {activeTab === "perfil" && <PerfilUsuario />}
      </main>

      {/* STICKY CART BOTTOM */}
      {activeTab === "comprar" && (
        <div className="fixed left-0 right-0 bottom-0 bg-white border-t shadow-lg p-4 flex items-center justify-between md:justify-end gap-4">
          <div className="flex items-center gap-3 md:mr-auto">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              <span className="font-medium">{totalItems} artículos</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-gray-700">
              <span className="text-sm">Total:</span>
              <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Pagar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCliente;