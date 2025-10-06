import {  useState, useEffect, useMemo } from 'react';
import { ShoppingCart, Eye, Trash2 } from "lucide-react";
import Modal from "../components/Modal"; // Importamos el componente Modal directamente

/* ---- Componentes de Íconos Inline ---- */
const SearchIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
  </svg>
);
const FilterIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M7 12h10M10 18h4" />
  </svg>
);
const HeartIcon = ({ filled = false, className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor">
    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M20.8 8.6a5.6 5.6 0 00-9.6-4l-.2.2-.2-.2a5.6 5.6 0 00-9.6 4c-.3 3 2.2 6.2 6 9.4l4.8 3.5 4.8-3.5c3.8-3.2 6.3-6.4 6-9.4z" />
  </svg>
);

const ComprasCliente = ({ cart, setCart }) => {
    // Filtros / UI state
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("");
    const [priceMin, setPriceMin] = useState("");
    const [priceMax, setPriceMax] = useState("");

    // Modal de "Añadir al carrito" (Primer código)
    const [modalOpen, setModalOpen] = useState(false);
    const [modalProduct, setModalProduct] = useState(null);
    const [modalQty, setModalQty] = useState(1);

     // Nuevo estado para el modal de "Ver producto"
    const [selectedProduct, setSelectedProduct] = useState(null);

        // Modal de "Ver carrito" (Segundo código)
    const [isCartOpen, setIsCartOpen] = useState(false);

        // Favoritos
    const [favorites, setFavorites] = useState([]);

    const [products, setProducts] = useState([]);

    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/productos/');
          const data = await response.json();
          setProducts(data);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
        };
        fetchProducts();
    }, []);
  

  const categories = useMemo(
    () => ["", ...Array.from(new Set(products.map((p) => p.categoria)))],
    [products]
  );

    // Productos de ejemplo.

   // Filtrado / búsqueda / orden
  const filteredProducts = useMemo(() => {
    let res = products.filter((p) =>
      p.nombre.toLowerCase().includes(search.trim().toLowerCase())
    );
    if (category) res = res.filter((p) => p.categoria === category);
    if (priceMin !== "") res = res.filter((p) => p.precio >= parseFloat(priceMin));
    if (priceMax !== "") res = res.filter((p) => p.precio <= parseFloat(priceMax));
    if (sort === "asc") res = res.sort((a, b) => a.precio - b.precio);
    if (sort === "desc") res = res.sort((a, b) => b.precio - a.precio);
    return res;
  }, [search, category, priceMin, priceMax, sort, products]);

    // Añadir al carrito
    // Funcionalidades del carrito del segundo código
  const addToCart = (product, quantity = 1) => {
    const existing = cart.find((item) => item.id_producto === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id_producto === product.id
            ? { ...item, cantidad: item.cantidad + quantity }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, cantidad: quantity }]);
    }
    // Si la función es llamada desde el modal de cantidad, cerrarlo
    if (modalOpen) {
      setModalOpen(false);
    }

    // anadir el item a la base de datos
    fetch('http://127.0.0.1:8000/api/carrito/agregar-item/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        id_producto: product.id,
        cantidad: quantity,
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Item agregado al carrito:', data);
    })
    .catch((error) => {
      console.error('Error al agregar item al carrito:', error);
    });

  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  // Helpers del primer código
  const openQtyModal = (product) => {
    setModalProduct(product);
    setModalQty(1);
    setModalOpen(true);
  };
  
  

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-6">
              <div className="flex-1 relative">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border rounded-md py-2 pl-10 pr-3 shadow-sm"
                  placeholder="Buscar productos por nombre..."
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <SearchIcon className="w-5 h-5" />
                </div>
              </div>

              <div className="flex gap-3 mt-3 md:mt-0 flex-wrap">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="border rounded-md py-2 px-3"
                >
                  {categories.map((c, i) => (
                    <option key={i} value={c}>
                      {c === "" ? "Todas las categorías" : c}
                    </option>
                  ))}
                </select>

                <select value={sort} onChange={(e) => setSort(e.target.value)} className="border rounded-md py-2 px-3">
                  <option value="">Ordenar</option>
                  <option value="asc">Precio: menor a mayor</option>
                  <option value="desc">Precio: mayor a menor</option>
                </select>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="w-20 border rounded-md py-2 px-2"
                  />
                  <span className="text-gray-400">—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="w-20 border rounded-md py-2 px-2"
                  />
                </div>

                <button
                  onClick={() => {
                    setSearch("");
                    setCategory("");
                    setSort("");
                    setPriceMin("");
                    setPriceMax("");
                  }}
                  className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-100"
                >
                  <FilterIcon className="w-5 h-5" /> Limpiar
                </button>
              </div>
            </div>

            {/* Lista productos en grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <div key={p.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
                  <img src={p.imagen_url} alt={p.nombre} className="w-full h-40 object-cover rounded-md mb-3" />
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{p.nombre}</h3>
                      <p className="text-sm text-gray-500">{p.categoria}</p>
                    </div>
                    <button onClick={() => toggleFavorite(p.id)} className="ml-3">
                      <HeartIcon filled={favorites.includes(p.id)} className={`w-5 h-5 ${favorites.includes(p.id) ? "text-red-500" : "text-gray-400"}`} />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <p className="text-blue-600 font-bold text-lg">${p.precio.toFixed(2)}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openQtyModal(p)}
                        className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 flex items-center gap-1"
                      >
                        <ShoppingCart size={16} /> Añadir
                      </button>
                      <button 
                        onClick={() => setSelectedProduct(p)} 
                        className="px-3 py-2 border rounded hover:bg-gray-100 flex items-center gap-1">
                        <Eye size={16} /> Ver
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* MODAL CANTIDAD */}
            {modalOpen && modalProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
                <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
                    <h3 className="text-xl font-semibold mb-2">Agregar al carrito</h3>
                    <p className="text-sm text-gray-600 mb-4">{modalProduct.nombre}</p>

                    <div className="flex items-center gap-3 mb-4">
                    <label className="text-sm w-24">Cantidad</label>
                    <input
                        type="number"
                        min="1"
                        value={modalQty}
                        onChange={(e) => setModalQty(Math.max(1, parseInt(e.target.value || 1)))}
                        className="border rounded px-3 py-2 w-28"
                    />
                    <div className="ml-auto text-right">
                        <p className="text-sm text-gray-500">Precio unitario</p>
                        <p className="font-bold">${modalProduct.precio.toFixed(2)}</p>
                    </div>
                    </div>

                    <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-500">Subtotal</p>
                        <p className="font-bold">${(modalQty * modalProduct.precio).toFixed(2)}</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded">Cancelar</button>
                        <button 
                            onClick={() => addToCart(modalProduct, modalQty)} 
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Confirmar
                        </button>
                    </div>
                    </div>
                </div>
                </div>
            )}

            {/* MODAL DE DETALLES DEL PRODUCTO */}
                  {selectedProduct && (
                      <Modal onClose={() => setSelectedProduct(null)}>
                        <div className="p-4">
                          <img
                            src={selectedProduct.imagen_url}
                            alt={selectedProduct.nombre}
                            className="w-full h-60 object-cover rounded-lg"
                          />
                          <h2 className="text-xl font-bold mt-4">{selectedProduct.nombre}</h2>
                          <p className="text-gray-600 mt-2">{selectedProduct.descripcion}</p>
                          <p className="text-blue-600 font-bold text-lg mt-3">
                            ${selectedProduct.precio.toFixed(2)}
                          </p>
                          <button 
                            onClick={() => {
                              addToCart(selectedProduct);
                              setSelectedProduct(null);
                            }} 
                            className="mt-4 flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                          >
                              <ShoppingCart size={16} className="mr-2" /> Añadir al carrito
                          </button>
                        </div>
                      </Modal>
                    )}

            {/* Modal de "Ver carrito" */}
            {isCartOpen && (
                <Modal onClose={() => setIsCartOpen(false)}>
                <div className="p-4">
                    <h2 className="text-xl font-bold mb-4">Carrito</h2>
                    {cart.length === 0 ? (
                    <p className="text-gray-500">Tu carrito está vacío.</p>
                    ) : (
                    <ul className="space-y-4">
                        {cart.map((item) => (
                        <li key={item.id} className="flex justify-between items-center border-b pb-2">
                            <span>{item.name} (x{item.quantity})</span>
                            <div className="flex items-center space-x-2">
                            <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                +
                            </button>
                            <button
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="px-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            >
                                -
                            </button>
                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="px-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                <Trash2 size={16} />
                            </button>
                            </div>
                        </li>
                        ))}
                    </ul>
                    )}
                </div>
                </Modal>
            )}

            
          </>
    );
}

export default ComprasCliente;