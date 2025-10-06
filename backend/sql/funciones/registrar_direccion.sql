-- Funcion para registrar una direccion
CREATE OR REPLACE FUNCTION datos_usuario.registrar_direccion(
    p_direccion TEXT,
    p_parroquia_id INT,
    p_usuario_id INT
) RETURNS BOOL AS $$
BEGIN
    -- Insertar la nueva direccion en la tabla direcciones
    INSERT INTO datos_usuario.direcciones (direccion, parroquia_id, usuario_id)
    VALUES (p_direccion, p_parroquia_id, p_usuario_id);

    -- Retornar verdadero si la insercion fue exitosa
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;