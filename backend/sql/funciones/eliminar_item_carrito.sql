-- Funcion para eliminar un item del carrito
CREATE OR REPLACE FUNCTION datos_tienda.eliminar_item_carrito(
    p_id_producto INT,
    p_id_carrito INT
) RETURNS BOOL AS $$
BEGIN
    -- verificar que el ID este en el carrito
    IF NOT EXISTS (SELECT 1 FROM datos_tienda.items_carrito WHERE producto_fk = p_id_producto AND carrito_fk = p_id_carrito) THEN
        RAISE EXCEPTION 'El producto con ID % no existe en el carrito con ID %', p_id_producto, p_id_carrito;
    END IF;

    -- eliminar el item del carrito
    DELETE FROM datos_tienda.items_carrito
    WHERE producto_fk = p_id_producto AND carrito_fk = p_id_carrito;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;