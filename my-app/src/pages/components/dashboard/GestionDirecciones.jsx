import { useState, useEffect, useMemo } from "react";
import { MapPin, Edit, Trash2, PlusCircle } from "lucide-react";
import Modal from "../Modal";

const GestionDirecciones = () => {
    const [direcciones, setDirecciones] = useState([]);
    // State for modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editSuccess, setEditSuccess] = useState(0);
    
    const [direccionActual, setDireccionActual] = useState(null); // To know which address is being edited

    // A single form state for both modals. It gets cleared or populated when a modal opens.
    const [formData, setFormData] = useState({
        alias: '',
        parroquia_id: '',
        direccion_completa: '',
        estado_id: '',
        municipio_id: '',
    });

    const [todasLasUbicaciones, setTodasLasUbicaciones] = useState([]);

    useEffect(() => {
        const fetchUbicaciones = async () => {
            try {
                // TODO: Replace with your actual API endpoint
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
        fetchUbicaciones();
    }, []);

    useEffect(()=>{
        const fetchDireccionesUsuario = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/direcciones/usuario/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });

                if (response.ok){
                    const data = await response.json();
                    setDirecciones(data);
                } else {
                    throw new Error("No se han obtenido datos");
                }
            } catch (error) {
                console.error('Ha ocurrido un error inesperado: ', error);
            }
        }

        fetchDireccionesUsuario();
    }, [editSuccess]);

    // These memoized filters will work for whichever modal is active, as they depend on the single `formData` state.
    const estadosFiltrados = useMemo(() => {
        return Array.from(new Set(todasLasUbicaciones.map(item => item.estado_id)))
            .map(id => todasLasUbicaciones.find(item => item.estado_id === id))
            .sort((a, b) => a.estado.localeCompare(b.estado));
    }, [todasLasUbicaciones]);

    const municipiosFiltrados = useMemo(() => {
        if (!formData.estado_id) return [];
        return Array.from(new Set(todasLasUbicaciones
            .filter(item => item.estado_id === parseInt(formData.estado_id))
            .map(item => item.municipio_id)))
            .map(id => todasLasUbicaciones.find(item => item.municipio_id === id))
            .sort((a, b) => a.municipio.localeCompare(b.municipio));
    }, [todasLasUbicaciones, formData.estado_id]);

    const parroquiasFiltradas = useMemo(() => {
        if (!formData.municipio_id) return [];
        return todasLasUbicaciones
            .filter(item => item.municipio_id === parseInt(formData.municipio_id))
            .sort((a, b) => a.parroquia.localeCompare(b.parroquia));
    }, [todasLasUbicaciones, formData.municipio_id]);

    // --- Modal and Form Handlers ---

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newState = { ...prev, [name]: value };
            if (name === 'estado_id') {
                newState.municipio_id = '';
                newState.parroquia_id = '';
            }
            if (name === 'municipio_id') {
                newState.parroquia_id = '';
            }
            return newState;
        });
    };

    // --- Add Address Modal Logic ---
    const handleOpenAddModal = () => {
        setDireccionActual(null);
        setFormData({
            alias: '', parroquia_id: '', direccion_completa: '',
            estado_id: '', municipio_id: '',
        });
        setShowAddModal(true);
    };

    const handleCloseAddModal = () => setShowAddModal(false);

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
            setEditSuccess(prev => prev + 1);
            setDirecciones(prev => [...prev, data]);
            alert(data.Exito);
            handleCloseAddModal();
        })
        .catch(error => console.error("Error al guardar la nueva dirección:", error));
    };

    // --- Edit Address Modal Logic ---
    const handleOpenEditModal = (dir) => {
        setDireccionActual(dir);
        const ubicacionCompleta = todasLasUbicaciones.find(u => u.parroquia_id == dir.parroquia_fk);

        setFormData({
            alias: dir.alias || '',
            parroquia_id: dir.parroquia_fk ? String(dir.parroquia_fk) : '',
            direccion_completa: dir.direccion_completa || '',
            estado_id: ubicacionCompleta ? String(ubicacionCompleta.estado_id) : '',
            municipio_id: ubicacionCompleta ? String(ubicacionCompleta.municipio_id) : '',
        });
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setDireccionActual(null);
    };

    const handleSaveUpdatedAddress = (e) => {
        e.preventDefault();
        const body = { ...formData, id_direccion: direccionActual.id_direccion };

        fetch("http://127.0.0.1:8000/api/direcciones/usuario/", {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(body),
        })
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(data => {
            setEditSuccess(prev => prev + 1);
            alert(data.Exito);
            handleCloseEditModal();
        })
        .catch(error => console.error("Error al actualizar la dirección:", error));
    };

    // --- Delete Logic ---
    const handleDelete = (id) => {
        // TODO: Implement API call to delete
        if (window.confirm("¿Estás seguro de que quieres eliminar esta dirección?")) {
            setDirecciones(direcciones.filter(d => d.id !== id));
            console.log("Dirección eliminada:", id);

            fetch("http://127.0.0.1:8000/api/direcciones/usuario/", {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({'id_direccion': id}),
            })
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(data => {
                setEditSuccess(prev => prev + 1);
                alert(data.Exito);
                handleCloseEditModal();
            })
            .catch(error => console.error("Error al eliminar la dirección:", error));
        }
    };

    const AddressFormFields = ( // Creating a sub-component for the form fields to avoid duplication
        <>
            <div className="mb-4">
                <label className="block text-gray-700 mb-1">Alias</label>
                <input type="text" name="alias" value={formData.alias} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required />
            </div>
            
            <div className="mb-4">
                <label className="block text-gray-700 mb-1">Estado</label>
                <select name="estado_id" value={formData.estado_id} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required>
                    <option value="">Seleccione un Estado</option>
                    {estadosFiltrados.map(estado => (
                        <option key={estado.estado_id} value={estado.estado_id}>{estado.estado}</option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 mb-1">Municipio</label>
                <select name="municipio_id" value={formData.municipio_id} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required disabled={!formData.estado_id}>
                    <option value="">Seleccione un Municipio</option>
                    {municipiosFiltrados.map(municipio => (
                        <option key={municipio.municipio_id} value={municipio.municipio_id}>{municipio.municipio}</option>
                    ))}
                </select>
            </div>

             <div className="mb-4">
                <label className="block text-gray-700 mb-1">Parroquia</label>
                <select name="parroquia_id" value={formData.parroquia_id} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required disabled={!formData.municipio_id}>
                    <option value="">Seleccione una Parroquia</option>
                    {parroquiasFiltradas.map(parroquia => (
                        <option key={parroquia.parroquia_id} value={parroquia.parroquia_id}>{parroquia.parroquia}</option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 mb-1">Dirección Completa</label>
                <textarea name="direccion_completa" value={formData.direccion_completa} placeholder="Calle XX, Casa 20, Sector Nueva Esparta" className="w-full px-3 py-2 border rounded-lg" onChange={handleChange} required></textarea>
            </div>
        </>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Mis Direcciones</h2>
                <button onClick={handleOpenAddModal} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                    <PlusCircle size={20} />
                    <span>Agregar Dirección</span>
                </button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                {direcciones.map(dir => (
                    <div key={dir.id_direccion} className="bg-white shadow rounded-lg p-5 flex justify-between items-start">
                        <div>
                            <p className="font-bold text-lg flex items-center gap-2"><MapPin size={20} className="text-gray-400" /> {dir.alias}</p>
                            <p className="text-gray-600 mt-2">{dir.direccion_completa}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleOpenEditModal(dir)} className="p-2 text-gray-500 hover:text-blue-600"><Edit size={18} /></button>
                            <button onClick={() => handleDelete(dir.id_direccion)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Address Modal */}
            {showAddModal && (
                <Modal onClose={handleCloseAddModal} className="max-w-lg p-[20px]">
                    <h3 className="text-2xl font-bold mb-4">Nueva Dirección</h3>
                    <form onSubmit={handleSaveNewAddress} className="space-y-4 p-4">
                        {AddressFormFields}
                        <div className="flex justify-end gap-4 mt-6">
                            <button type="button" onClick={handleCloseAddModal} className="px-4 py-2 bg-gray-200 rounded-lg">Cancelar</button>
                            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Guardar</button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Edit Address Modal */}
            {showEditModal && (
                <Modal onClose={handleCloseEditModal} className="max-w-lg p-[20px]">
                    <h3 className="text-2xl font-bold mb-4">Editar Dirección</h3>
                    <form onSubmit={handleSaveUpdatedAddress} className="space-y-4 p-4">
                        {AddressFormFields}
                        <div className="flex justify-end gap-4 mt-6">
                            <button type="button" onClick={handleCloseEditModal} className="px-4 py-2 bg-gray-200 rounded-lg">Cancelar</button>
                            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Guardar Cambios</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default GestionDirecciones;
