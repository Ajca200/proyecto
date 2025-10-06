CREATE OR REPLACE FUNCTION datos_tienda.registrar_item_carrito(
	p_id_carrito INTEGER,
	p_item INTEGER,
	p_cantidad INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql AS $$
BEGIN
	-- Validar que el carrito exista
	IF NOT EXISTS (SELECT 1 FROM datos_tienda.carritos WHERE id_carrito = p_id_carrito) THEN
		RAISE EXCEPTION 'El usuario no posee carrito registrado';
	END IF;

	-- Validar que el item exista
	IF NOT EXISTS (SELECT 1 FROM datos_tienda.productos WHERE id_producto = p_item) THEN
		RAISE EXCEPTION 'El item ingresado no existe';
	END IF;

	-- Validar que la cantidad sea positiva
	IF p_cantidad <= 0 THEN
		RAISE EXCEPTION 'La cantidad debe ser un valor positivo';
	END IF;

	-- validar que el item este se encuentre en el carrito
	IF EXISTS (SELECT 1 FROM datos_tienda.items_carrito WHERE carrito_fk = p_id_carrito AND producto_fk = p_item) THEN
		-- Actualizar la cantidad del item en el carrito
		UPDATE datos_tienda.items_carrito SET cantidad = cantidad + p_cantidad
		WHERE carrito_fk = p_id_carrito AND producto_fk = p_item;

		RETURN TRUE;
	END IF;

	-- Insertar el item en el carrito
	INSERT INTO datos_tienda.items_carrito (carrito_fk, producto_fk, cantidad)
	VALUES (p_id_carrito, p_item, p_cantidad);

	RETURN TRUE;
END;
$$;

-- Ejemplo de uso
SELECT * FROM datos_tienda.registrar_item_carrito(1, 2, 3);