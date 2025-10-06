import {  Trash2, ShoppingCart } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

const CarritoCompra = ({ cart, setCart, totalItems, totalPrice }) => {

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id_producto !== id));

    // Eliminar el item en el backend
    fetch('http://127.0.0.1:8000/api/carrito/eliminar-item/', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'Application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ id_producto: id }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al eliminar el item en el servidor');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error de red al eliminar el item', error);
    }
    );
  };

  const updateQuantity = (id, newQuantity) => {
    setCart(
      cart.map((item) =>
        item.id_producto === id ? { ...item, cantidad: newQuantity } : item
      )
    );

    // Actualizar en el backend
    fetch(`http://127.0.0.1:8000/api/carrito/actualizar-item/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ id_producto: id, cantidad: newQuantity }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al actualizar la cantidad en el servidor');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error de red al actualizar la cantidad', error);
    });
  };


  return (
    <>
      <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Mi Carrito</h2>
            <div className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-gray-500">Tu carrito está vacío.</p>
              ) : (
                <ul className="space-y-4">
                  {cart.map((item) => (
                    <li key={item.id_producto} className="flex justify-between items-center border-b pb-2">
                      <span>{item.nombre} (x{item.cantidad})</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id_producto, item.cantidad + 1)}
                          className="px-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          +
                        </button>
                        <button
                          onClick={() => updateQuantity(item.id_producto, Math.max(1, item.cantidad - 1))}
                          className="px-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          -
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id_producto)}
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
            <div className="mt-6 flex justify-end items-center gap-4">
                <p className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</p>
                <button className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold">Pagar</button>
            </div>
          </div>
    </>
  )
}

export default CarritoCompra;