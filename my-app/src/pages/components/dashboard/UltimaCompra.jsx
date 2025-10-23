import { useState, useEffect } from 'react';

const estados = ['Procesando', 'En camino', 'Entregado'];

const UltimaCompra = () => {
  const [ultima, setUltima] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUltimaCompra = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/ultima-compra/', {
          credentials: 'include', // para enviar cookies de sesión
        });

        if (!response.ok) {
          if (response.status === 404) {
            setUltima(null); // No hay compras
          } else {
            throw new Error('Error al obtener los datos');
          }
        } else {
            const data = await response.json();
            setUltima(data);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUltimaCompra();
  }, []);


  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!ultima) {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Última Compra</h2>
            <div className="bg-white shadow rounded-lg p-6">
                <p>No tienes compras recientes.</p>
            </div>
        </div>
    );
  }

  const estadoActualIndex = estados.indexOf(ultima.estado);
  console.log(estadoActualIndex)
  const progressPercentage = (estadoActualIndex / (estados.length - 1)) * 100;

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
        
        <div className="mt-8">
          <div className="relative">
            <div className="h-1 bg-gray-300 rounded-full"></div>
            <div 
              className="absolute top-0 h-1 bg-blue-500 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            {estados.map((estado, index) => (
              <div key={estado} className="text-center flex-1">
                <div className={`mx-auto w-6 h-6 rounded-full flex items-center justify-center ${index <= estadoActualIndex ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                  {index < estadoActualIndex ? '✓' : index + 1}
                </div>
                <p className={`mt-2 text-sm ${index <= estadoActualIndex ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>{estado}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UltimaCompra;
