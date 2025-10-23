import { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, Eye, Trash2, MapPin, PlusCircle } from "lucide-react";
import Modal from "../components/Modal";

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

const PAYMENT_DETAILS = {
    binance: {
        email: 'correo2025@gmail.com'
    },
    pagomovil: {
        bank: 'Banco de Venezuela',
        id: 'V-00.000.000',
        phone: '0414-0000000'
    },
    transferencia: {
        bank: 'Banco de Venezuela',
        name: 'JXXX ANXXXXX',
        account: '010200011110000011'
    }
};

const ComprasCliente = ({ cart, setCart, isCartOpen, setIsCartOpen }) => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("");
    const [priceMin, setPriceMin] = useState("");
    const [priceMax, setPriceMax] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [modalProduct, setModalProduct] = useState(null);
    const [modalQty, setModalQty] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [favorites, setFavorites] = useState([]);

    // --- Payment Modal State ---
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentStep, setPaymentStep] = useState(1);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [paymentReceipt, setPaymentReceipt] = useState(null);
    const [sourceEmail, setSourceEmail] = useState('');
    const [paymentSubmitted, setPaymentSubmitted] = useState(false);
    const [referenceNumber, setReferenceNumber] = useState('');

    // --- Address Management State (from GestionDirecciones) ---
    const [direcciones, setDirecciones] = useState([]);
    const [todasLasUbicaciones, setTodasLasUbicaciones] = useState([]);
    const [addressFetchSuccess, setAddressFetchSuccess] = useState(0);
    const [formData, setFormData] = useState({
        alias: '', parroquia_id: '', direccion_completa: '',
        estado_id: '', municipio_id: '',
    });


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

    // --- Fetching logic for addresses and locations (when payment modal opens) ---
    useEffect(() => {
        if (!isPaymentModalOpen) return;

        const fetchUbicaciones = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/direcciones/', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    setTodasLasUbicaciones(data || []);
                } else {
                    console.error('Error al cargar ubicaciones');
                }
            } catch (error) {
                console.error('Error de red al cargar ubicaciones', error);
            }
        };

        const fetchDireccionesUsuario = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/direcciones/usuario/', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    setDirecciones(data);
                } else {
                    throw new Error("No se han obtenido datos de direcciones");
                }
            } catch (error) {
                console.error('Ha ocurrido un error inesperado: ', error);
            }
        };

        fetchUbicaciones();
        fetchDireccionesUsuario();
    }, [isPaymentModalOpen, addressFetchSuccess]);

    const categories = useMemo(() => ["", ...Array.from(new Set(products.map((p) => p.categoria)))], [products]);

    const filteredProducts = useMemo(() => {
        let res = products.filter((p) => p.nombre.toLowerCase().includes(search.trim().toLowerCase()));
        if (category) res = res.filter((p) => p.categoria === category);
        if (priceMin !== "") res = res.filter((p) => p.precio >= parseFloat(priceMin));
        if (priceMax !== "") res = res.filter((p) => p.precio <= parseFloat(priceMax));
        if (sort === "asc") res = res.sort((a, b) => a.precio - b.precio);
        if (sort === "desc") res = res.sort((a, b) => b.precio - a.precio);
        return res;
    }, [search, category, priceMin, priceMax, sort, products]);

    // --- Cart Logic ---
    const addToCart = (product, quantity = 1) => {
        const existingItem = cart.find((item) => item.id_producto === product.id);
        if (existingItem) {
            updateQuantity(product.id, existingItem.cantidad + quantity);
        } else {
            setCart(prevCart => [...prevCart, { ...product, id_producto: product.id, cantidad: quantity }]);
            // API call to add new item
            fetch('http://127.0.0.1:8000/api/carrito/agregar-item/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id_producto: product.id, cantidad: quantity }),
            }).then(res => res.json()).then(data => console.log('Item added:', data)).catch(console.error);
        }
        if (modalOpen) setModalOpen(false);
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCart(cart.map(item => item.id_producto === productId ? { ...item, cantidad: newQuantity } : item));
        // API call to update quantity
        fetch('http://127.0.0.1:8000/api/carrito/actualizar-item/', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id_producto: productId, cantidad: newQuantity }),
        }).then(res => res.json()).then(data => console.log('Quantity updated:', data)).catch(console.error);
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.id_producto !== productId));
        // API call to delete item
        fetch('http://127.0.0.1:8000/api/carrito/eliminar-item/', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id_producto: productId }),
        }).then(res => res.json()).then(data => console.log('Item removed:', data)).catch(console.error);
    };

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        if (!paymentReceipt) {
            alert('Por favor, sube un comprobante de pago.');
            return;
        }
        if (selectedPaymentMethod === 'binance' && !sourceEmail) {
            alert('Por favor, ingresa tu correo de origen de Binance.');
            return;
        }
        if ((selectedPaymentMethod === 'pagomovil' || selectedPaymentMethod === 'transferencia') && !referenceNumber) {
            alert('Por favor, ingresa el número de referencia.');
            return;
        }

        const formData = new FormData();
        formData.append('method', selectedPaymentMethod);
        formData.append('total', cartTotal);
        formData.append('address_id', selectedAddress);
        formData.append('items', JSON.stringify(cart.map(item => ({ id: item.id_producto, qty: item.cantidad, pco: item.precio }))));

        if (paymentReceipt) formData.append('receipt', paymentReceipt);
        if (selectedPaymentMethod === 'binance' && sourceEmail) formData.append('source_email', sourceEmail);
        if ((selectedPaymentMethod === 'pagomovil' || selectedPaymentMethod === 'transferencia') && referenceNumber) {
            formData.append('reference_number', referenceNumber);
        }

        fetch('http://127.0.0.1:8000/api/payment/', {
            method: 'POST',
            credentials: 'include',
            body: formData // Do NOT set Content-Type; browser will add multipart/form-data with boundary
        })
            .then(async (res) => {
                if (!res.ok) {
                    const errText = await res.text();
                    throw new Error(errText || 'Payment request failed');
                }
                return res.json();
            })
            .then((data) => {
                console.log('Payment submitted successfully:', data);
                setPaymentSubmitted(true);
                // handle response if needed (e.g., show order id)
            })
            .catch((err) => {
                console.error('Error submitting payment:', err);
                alert('Error al enviar el pago. Intenta nuevamente.');
            });

    };

    const toggleFavorite = (id) => {
        setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const openQtyModal = (product) => {
        setModalProduct(product);
        setModalQty(1);
        setModalOpen(true);
    };

    const cartTotal = cart.reduce((total, item) => total + item.precio * item.cantidad, 0);

    // --- Address Form Logic (from GestionDirecciones) ---
    const estadosFiltrados = useMemo(() => Array.from(new Set(todasLasUbicaciones.map(item => item.estado_id))).map(id => todasLasUbicaciones.find(item => item.estado_id === id)).sort((a, b) => a.estado.localeCompare(b.estado)), [todasLasUbicaciones]);
    const municipiosFiltrados = useMemo(() => {
        if (!formData.estado_id) return [];
        return Array.from(new Set(todasLasUbicaciones.filter(item => item.estado_id === parseInt(formData.estado_id)).map(item => item.municipio_id))).map(id => todasLasUbicaciones.find(item => item.municipio_id === id)).sort((a, b) => a.municipio.localeCompare(b.municipio));
    }, [todasLasUbicaciones, formData.estado_id]);
    const parroquiasFiltradas = useMemo(() => {
        if (!formData.municipio_id) return [];
        return todasLasUbicaciones.filter(item => item.municipio_id === parseInt(formData.municipio_id)).sort((a, b) => a.parroquia.localeCompare(b.parroquia));
    }, [todasLasUbicaciones, formData.municipio_id]);

    const handleAddressFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newState = { ...prev, [name]: value };
            if (name === 'estado_id') { newState.municipio_id = ''; newState.parroquia_id = ''; }
            if (name === 'municipio_id') { newState.parroquia_id = ''; }
            return newState;
        });
    };

    const handleSaveNewAddress = (e) => {
        e.preventDefault();
        fetch("http://127.0.0.1:8000/api/direcciones/", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(formData),
        })
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(data => {
            setAddressFetchSuccess(prev => prev + 1);
            alert(data.Exito || "Dirección guardada");
            setShowNewAddressForm(false);
            setFormData({ alias: '', parroquia_id: '', direccion_completa: '', estado_id: '', municipio_id: '' });
            // Automatically select the new address
            setTimeout(() => setSelectedAddress(data.id_direccion), 100);
        })
        .catch(error => console.error("Error al guardar la nueva dirección:", error));
    };

    const AddressFormFields = (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="alias" value={formData.alias} onChange={handleAddressFormChange} placeholder="Alias (e.g., Casa, Trabajo)" className="w-full px-3 py-2 border rounded-lg" required />
                <select name="estado_id" value={formData.estado_id} onChange={handleAddressFormChange} className="w-full px-3 py-2 border rounded-lg" required>
                    <option value="">Seleccione un Estado</option>
                    {estadosFiltrados.map(estado => <option key={estado.estado_id} value={estado.estado_id}>{estado.estado}</option>)}
                </select>
                <select name="municipio_id" value={formData.municipio_id} onChange={handleAddressFormChange} className="w-full px-3 py-2 border rounded-lg" required disabled={!formData.estado_id}>
                    <option value="">Seleccione un Municipio</option>
                    {municipiosFiltrados.map(municipio => <option key={municipio.municipio_id} value={municipio.municipio_id}>{municipio.municipio}</option>)}
                </select>
                <select name="parroquia_id" value={formData.parroquia_id} onChange={handleAddressFormChange} className="w-full px-3 py-2 border rounded-lg" required disabled={!formData.municipio_id}>
                    <option value="">Seleccione una Parroquia</option>
                    {parroquiasFiltradas.map(parroquia => <option key={parroquia.parroquia_id} value={parroquia.parroquia_id}>{parroquia.parroquia}</option>)}
                </select>
            </div>
            <textarea name="direccion_completa" value={formData.direccion_completa} placeholder="Dirección Completa (e.g., Calle XX, Casa 20)" className="w-full px-3 py-2 border rounded-lg mt-4" onChange={handleAddressFormChange} required></textarea>
        </>
    );

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-6">
                <div className="flex-1 relative">
                    <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border rounded-md py-2 pl-10 pr-3 shadow-sm" placeholder="Buscar productos por nombre..." />
                    <div className="absolute left-3 top-2.5 text-gray-400"><SearchIcon /></div>
                </div>
                <div className="flex gap-3 mt-3 md:mt-0 flex-wrap">
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded-md py-2 px-3">
                        {categories.map((c, i) => <option key={i} value={c}>{c === "" ? "Todas las categorías" : c}</option>)}
                    </select>
                    <select value={sort} onChange={(e) => setSort(e.target.value)} className="border rounded-md py-2 px-3">
                        <option value="">Ordenar</option>
                        <option value="asc">Precio: menor a mayor</option>
                        <option value="desc">Precio: mayor a menor</option>
                    </select>
                    <div className="flex items-center gap-2">
                        <input type="number" placeholder="Min" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} className="w-20 border rounded-md py-2 px-2" />
                        <span className="text-gray-400">—</span>
                        <input type="number" placeholder="Max" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} className="w-20 border rounded-md py-2 px-2" />
                    </div>
                    <button onClick={() => { setSearch(""); setCategory(""); setSort(""); setPriceMin(""); setPriceMax(""); }} className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-100">
                        <FilterIcon /> Limpiar
                    </button>
                </div>
            </div>

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
                                <button onClick={() => openQtyModal(p)} className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 flex items-center gap-1">
                                    <ShoppingCart size={16} /> Añadir
                                </button>
                                <button onClick={() => setSelectedProduct(p)} className="px-3 py-2 border rounded hover:bg-gray-100 flex items-center gap-1">
                                    <Eye size={16} /> Ver
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {modalOpen && modalProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
                        <h3 className="text-xl font-semibold mb-2">Agregar al carrito</h3>
                        <p className="text-sm text-gray-600 mb-4">{modalProduct.nombre}</p>
                        <div className="flex items-center gap-3 mb-4">
                            <label className="text-sm w-24">Cantidad</label>
                            <input type="number" min="1" value={modalQty} onChange={(e) => setModalQty(Math.max(1, parseInt(e.target.value || 1)))} className="border rounded px-3 py-2 w-28" />
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
                                <button onClick={() => addToCart(modalProduct, modalQty)} className="px-4 py-2 bg-blue-600 text-white rounded">Confirmar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedProduct && (
                <Modal onClose={() => setSelectedProduct(null)}>
                    <div className="p-4">
                        <img src={selectedProduct.imagen_url} alt={selectedProduct.nombre} className="w-full h-60 object-cover rounded-lg" />
                        <h2 className="text-xl font-bold mt-4">{selectedProduct.nombre}</h2>
                        <p className="text-gray-600 mt-2">{selectedProduct.descripcion}</p>
                        <p className="text-blue-600 font-bold text-lg mt-3">${selectedProduct.precio.toFixed(2)}</p>
                        <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="mt-4 flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                            <ShoppingCart size={16} className="mr-2" /> Añadir al carrito
                        </button>
                    </div>
                </Modal>
            )}

            {isCartOpen && (
                <Modal onClose={() => setIsCartOpen(false)}>
                    <div className="p-4">
                        <h2 className="text-xl font-bold mb-4">Carrito</h2>
                        {cart.length === 0 ? (
                            <p className="text-gray-500">Tu carrito está vacío.</p>
                        ) : (
                            <>
                                <ul className="space-y-4 max-h-80 overflow-y-auto">
                                    {cart.map((item) => (
                                        <li key={item.id_producto} className="flex justify-between items-center border-b pb-2">
                                            <div>
                                                <p className="font-semibold">{item.nombre}</p>
                                                <p className="text-sm text-gray-500">${item.precio.toFixed(2)} x {item.cantidad}</p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button onClick={() => updateQuantity(item.id_producto, item.cantidad - 1)} className="p-1 border rounded">-</button>
                                                <span>{item.cantidad}</span>
                                                <button onClick={() => updateQuantity(item.id_producto, item.cantidad + 1)} className="p-1 border rounded">+</button>
                                                <button onClick={() => removeFromCart(item.id_producto)} className="p-2 text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-4 pt-4 border-t">
                                    <p className="text-lg font-bold text-right">Total: ${cartTotal.toFixed(2)}</p>
                                    <button
                                        onClick={() => { setIsCartOpen(false); setIsPaymentModalOpen(true); setPaymentStep(1); }}
                                        disabled={cart.length === 0}
                                        className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-400"
                                    >
                                        Proceder al Pago
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </Modal>
            )}

            {isPaymentModalOpen && (
                <Modal onClose={() => setIsPaymentModalOpen(false)} className="max-w-3xl p-0">
                    <div className="p-6">
                        <div className="flex items-center mb-6">
                            {['Dirección', 'Pago', 'Confirmar'].map((step, index) => (
                                <div key={index} className="flex items-center w-full">
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${paymentStep > index + 1 ? 'bg-green-500 text-white' : paymentStep === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                                        {paymentStep > index + 1 ? '✓' : index + 1}
                                    </div>
                                    <p className={`ml-3 font-medium ${paymentStep >= index + 1 ? 'text-gray-800' : 'text-gray-500'}`}>{step}</p>
                                    {index < 2 && <div className={`flex-auto border-t-2 mx-4 ${paymentStep > index + 1 ? 'border-green-500' : 'border-gray-200'}`}></div>}
                                </div>
                            ))}
                        </div>

                        {paymentStep === 1 && (
                            <div>
                                <h3 className="text-xl font-bold mb-4">Selecciona tu dirección de envío</h3>
                                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                    {direcciones.map(dir => (
                                        <div key={dir.id_direccion} onClick={() => setSelectedAddress(dir.id_direccion)} className={`p-4 border rounded-lg cursor-pointer flex items-center gap-4 ${selectedAddress === dir.id_direccion ? 'border-blue-500 bg-blue-50' : ''}`}>
                                            <MapPin className="text-gray-500" />
                                            <div>
                                                <p className="font-bold">{dir.alias}</p>
                                                <p className="text-sm text-gray-600">{dir.direccion_completa}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4">
                                    <label className="flex items-center cursor-pointer">
                                        <input type="checkbox" checked={showNewAddressForm} onChange={(e) => setShowNewAddressForm(e.target.checked)} className="mr-2 h-4 w-4" />
                                        Agregar una nueva dirección
                                    </label>
                                </div>
                                {showNewAddressForm && (
                                    <form onSubmit={handleSaveNewAddress} className="mt-4 p-4 border rounded-lg bg-gray-50 space-y-4">
                                        <h4 className="font-semibold">Nueva Dirección</h4>
                                        {AddressFormFields}
                                        <div className="flex justify-end"><button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Guardar Dirección</button></div>
                                    </form>
                                )}
                                <div className="flex justify-end gap-4 mt-6">
                                    <button onClick={() => setIsPaymentModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancelar</button>
                                    <button onClick={() => setPaymentStep(2)} disabled={!selectedAddress} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400">Siguiente</button>
                                </div>
                            </div>
                        )}

                        {paymentStep === 2 && (
                            <div>
                                <h3 className="text-xl font-bold mb-4">Selecciona tu método de pago</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[{id: 'paypal', name: 'PayPal', type: 'Internacional'}, {id: 'binance', name: 'Binance (USDT)', type: 'Internacional'}, {id: 'pagomovil', name: 'Pago Móvil', type: 'Nacional'}, {id: 'transferencia', name: 'Transferencia', type: 'Nacional'}].map(method => (
                                        <div key={method.id} onClick={() => setSelectedPaymentMethod(method.id)} className={`p-4 border rounded-lg cursor-pointer ${selectedPaymentMethod === method.id ? 'border-blue-500 bg-blue-50' : ''}`}>
                                            <h4 className="font-bold">{method.name}</h4>
                                            <p className="text-sm text-gray-500">{method.type}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between gap-4 mt-6">
                                    <button onClick={() => setPaymentStep(1)} className="px-4 py-2 bg-gray-200 rounded-lg">Atrás</button>
                                    <button onClick={() => setPaymentStep(3)} disabled={!selectedPaymentMethod} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400">Siguiente</button>
                                </div>
                            </div>
                        )}

                        {paymentStep === 3 && (
                            <div>
                                {!paymentSubmitted ? (
                                    <>
                                        <h3 className="text-xl font-bold mb-2">Realizar Pago</h3>
                                        <p className="text-gray-600 mb-4">Monto total a pagar: <span className="font-bold text-blue-600 text-lg">${(cartTotal + (cartTotal * 0.16)).toFixed(2)} (IVA incluido)</span></p>

                                        {selectedPaymentMethod === 'binance' && (
                                            <div className="p-4 bg-gray-100 rounded-lg mb-4">
                                                <h4 className="font-semibold">Datos para pago con Binance (USDT)</h4>
                                                <p>Correo: <span className="font-mono bg-gray-200 px-2 py-1 rounded">{PAYMENT_DETAILS.binance.email}</span></p>
                                            </div>
                                        )}

                                        {selectedPaymentMethod === 'pagomovil' && (
                                            <div className="p-4 bg-gray-100 rounded-lg mb-4 space-y-1">
                                                <h4 className="font-semibold">Datos para Pago Móvil</h4>
                                                <p>Banco: <span className="font-medium">{PAYMENT_DETAILS.pagomovil.bank}</span></p>
                                                <p>Cédula: <span className="font-medium">{PAYMENT_DETAILS.pagomovil.id}</span></p>
                                                <p>Teléfono: <span className="font-medium">{PAYMENT_DETAILS.pagomovil.phone}</span></p>
                                            </div>
                                        )}

                                        {selectedPaymentMethod === 'transferencia' && (
                                            <div className="p-4 bg-gray-100 rounded-lg mb-4 space-y-1">
                                                <h4 className="font-semibold">Datos para Transferencia</h4>
                                                <p>Banco: <span className="font-medium">{PAYMENT_DETAILS.transferencia.bank}</span></p>
                                                <p>Beneficiario: <span className="font-medium">{PAYMENT_DETAILS.transferencia.name}</span></p>
                                                <p>Nro. Cuenta: <span className="font-medium">{PAYMENT_DETAILS.transferencia.account}</span></p>
                                            </div>
                                        )}

                                        <form onSubmit={handlePaymentSubmit}>
                                            <div className="space-y-4">
                                                {selectedPaymentMethod === 'binance' && (
                                                    <div>
                                                        <label htmlFor="sourceEmail" className="block text-sm font-medium text-gray-700 mb-1">Correo de Origen (Binance)</label>
                                                        <input
                                                            type="email"
                                                            id="sourceEmail"
                                                            value={sourceEmail}
                                                            onChange={(e) => setSourceEmail(e.target.value)}
                                                            className="w-full px-3 py-2 border rounded-lg"
                                                            required
                                                        />
                                                    </div>
                                                )}
                                                {(selectedPaymentMethod === 'pagomovil' || selectedPaymentMethod === 'transferencia') && (
                                                    <div>
                                                        <label htmlFor="referenceNumber" className="block text-sm font-medium text-gray-700 mb-1">Número de Referencia</label>
                                                        <input
                                                            type="text"
                                                            id="referenceNumber"
                                                            value={referenceNumber}
                                                            onChange={(e) => setReferenceNumber(e.target.value)}
                                                            className="w-full px-3 py-2 border rounded-lg"
                                                            required
                                                        />
                                                    </div>
                                                )}
                                                <div>
                                                    <label htmlFor="receipt" className="block text-sm font-medium text-gray-700 mb-1">Comprobante de Pago</label>
                                                    <input
                                                        type="file"
                                                        id="receipt"
                                                        onChange={(e) => setPaymentReceipt(e.target.files[0])}
                                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                        accept='image/*'
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-4 mt-6">
                                                <button type="button" onClick={() => setPaymentStep(2)} className="px-4 py-2 bg-gray-200 rounded-lg">Atrás</button>
                                                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg">He realizado el pago</button>
                                            </div>
                                        </form>
                                    </>
                                ) : (
                                    <div className="text-center p-8">
                                        <h3 className="text-2xl font-bold text-green-600 mb-3">¡Gracias por tu compra!</h3>
                                        <p className="text-gray-700">Hemos recibido tu información de pago.</p>
                                        <p className="font-semibold mt-2">Por favor, espera mientras verificamos tu pago. Recibirás una notificación una vez que sea procesado.</p>
                                        <button onClick={() => {
                                            setIsPaymentModalOpen(false);
                                            setPaymentSubmitted(false);
                                            setCart([]);
                                        }} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg">
                                            Entendido
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </Modal>
            )}
        </>
    );
}

export default ComprasCliente;