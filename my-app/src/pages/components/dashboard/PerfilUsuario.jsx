import { useState } from "react";
import Modal from "../Modal";

// TODO: Fetch user profile data from an API.
const mockUser = {
  nombre: 'Juan Pérez',
  email: 'juan.perez@email.com',
};

const PerfilUsuario = () => {
  const [user] = useState(mockUser);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // In a real app, this would send a request to the API.
    const formData = new FormData(e.target);
    const updatedUser = {
      nombre: formData.get('nombre'),
      email: formData.get('email'),
    };
    console.log("Perfil guardado:", updatedUser);
    // Here you would update the user state and show a success message.
    setShowEditModal(false);
  };

  const handleDeleteAccount = () => {
    // In a real app, this would send a request to the API to delete the account.
    console.log("Cuenta eliminada");
    // After deletion, you would likely redirect the user to the homepage or login page.
    setShowDeleteConfirm(false);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Mi Perfil</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <div className="md:col-span-2 bg-white shadow rounded-lg p-5">
          <h3 className="font-bold text-lg mb-4">Información Actual</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Nombre</p>
              <p className="font-semibold">{user.nombre}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <Modal onClose={() => setShowEditModal(false)}>
          <h3 className="text-2xl font-bold mb-4">Editar Perfil</h3>
          <form onSubmit={handleSaveProfile}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Nombre</label>
              <input name="nombre" type="text" defaultValue={user.nombre} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Email</label>
              <input name="email" type="email" defaultValue={user.email} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Guardar Cambios</button>
            </div>
          </form>
        </Modal>
      )}

      {showDeleteConfirm && (
        <Modal onClose={() => setShowDeleteConfirm(false)}>
          <h3 className="text-2xl font-bold mb-4">¿Estás seguro?</h3>
          <p className="text-gray-600 mb-6">Estás a punto de eliminar tu cuenta permanentemente. Todos tus datos se perderán.</p>
          <div className="flex justify-end gap-4">
            <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancelar</button>
            <button onClick={handleDeleteAccount} className="px-4 py-2 bg-red-600 text-white rounded-lg">Sí, Eliminar Cuenta</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PerfilUsuario;