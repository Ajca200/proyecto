CREATE OR REPLACE FUNCTION datos_tienda.obtener_productos()
RETURNS TABLE (
	r_id INTEGER,
	r_nombre VARCHAR,
	r_descripcion TEXT,
	r_precio NUMERIC,
	r_imagen_url VARCHAR,
	r_categoria VARCHAR
)
LANGUAGE plpgsql AS $$
BEGIN
	RETURN QUERY
	SELECT pro.id_producto, pro.nombre, pro.descripcion, pro.precio, pro.imagen_url, cat.nombre
	FROM datos_tienda.productos AS pro
	JOIN datos_tienda.categorias AS cat
		ON pro.categoria_fk = cat.id_categoria;
END;
$$;

SELECT * FROM datos_tienda.obtener_productos();