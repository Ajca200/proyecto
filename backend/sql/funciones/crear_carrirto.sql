CREATE OR REPLACE FUNCTION datos_tienda.crear_carrito(p_id_usuario INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql AS $$
	DECLARE v_id_carrito INTEGER;
BEGIN
	-- Validar que el usuario exista
	IF NOT EXISTS (SELECT 1 FROM datos_usuario.usuarios WHERE id_usuario = p_id_usuario) THEN
		RAISE EXCEPTION 'El Usuario ingresado no existe';
	END IF;

	-- Validar que el usuario no tenga un carrito ya creado
	IF EXISTS (SELECT 1 FROM datos_tienda.carritos WHERE usuario_fk = p_id_usuario) THEN
		RAISE EXCEPTION 'El Usuario ya posee un carrito registrado';
	END IF;

	-- Crear el carrito
	INSERT INTO datos_tienda.carritos (usuario_fk) VALUES (p_id_usuario)
	RETURNING id_carrito INTO v_id_carrito;

	-- Retornar el id del carrito creado
	RETURN v_id_carrito;
END;
$$;

SELECT * FROM datos_tienda.crear_carrito(23);