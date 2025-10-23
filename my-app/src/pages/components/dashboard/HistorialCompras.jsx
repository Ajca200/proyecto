import { Search } from "lucide-react";
import { useState, useEffect } from "react";

// TODO: Fetch purchase history from an API instead of using mock data.
const mockHistorial = [
  { id: 'A001', fecha: '2024-07-15', total: 125.50, estado: 'Entregado' },
  { id: 'A002', fecha: '2024-07-20', total: 89.99, estado: 'Entregado' },
  { id: 'A003', fecha: '2024-08-01', total: 250.00, estado: 'En camino' },
];

const HistorialCompras = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [historial, setHistorial] = useState([]);

  useEffect(()=>{
    const obtenerOrdenes = async () => {
      fetch('http://127.0.0.1:8000/api/historial-ordenes/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
      .then(response => response.json())
      .then(datos => {
        setHistorial(datos);
      })
      .catch(error => {
        console.error('Error fetching purchase history:', error);
      });
    }

    obtenerOrdenes();
  }, [])

  const handleSearch = () => {
    // In a real application, you might refetch data with date filters.
    console.log('Searching between', startDate, 'and', endDate);
  };

  const filteredHistorial = historial.filter(item => {
    if (!startDate || !endDate) return true;
    const itemDate = new Date(item.fecha);
    // Adjusting for timezone issues by comparing dates without time.
    const start = new Date(startDate);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);
    return itemDate >= start && itemDate <= end;
  });

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Historial de Compras</h2>
      
      <div className="bg-white shadow rounded-lg p-4 mb-6 flex items-center gap-4">
        <div className="flex-1">
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
          <input id="startDate" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div className="flex-1">
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
          <input id="endDate" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <button onClick={handleSearch} className="self-end px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2">
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
              <tr key={item.id_orden} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-5 py-4 text-sm">{item.id_orden}</td>
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

export default HistorialCompras;