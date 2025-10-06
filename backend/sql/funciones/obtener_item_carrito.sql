-- Funcion SQL para obtener los items en el carrito de un usuario
CREATE OR REPLACE FUNCTION datos_tienda.obtener_item_carrito(p_id_usuario INTEGER)
RETURNS TABLE (
    r_id_item INTEGER,
    r_nombre_producto VARCHAR,
    r_cantidad INTEGER,
    r_precio_unitario NUMERIC,
    r_precio_total NUMERIC
)
LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ic.id_item,
        p.nombre,
        ic.cantidad,
        p.precio,
        (ic.cantidad * p.precio) AS precio_total
    FROM 
        datos_tienda.items_carrito AS ic
    JOIN 
        datos_tienda.carritos AS c ON ic.carrito_fk = c.id_carrito
    JOIN 
        datos_tienda.productos AS p ON ic.producto_fk = p.id_producto
    WHERE 
        c.usuario_fk = p_id_usuario;
END;
$$;

-- Ejemplo de uso
SELECT * FROM datos_tienda.obtener_item_carrito(23);