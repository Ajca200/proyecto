-- Funcion para registrar una direccion
CREATE OR REPLACE FUNCTION datos_usuario.registrar_direccion(
    p_direccion TEXT,
    p_parroquia_id INT,
    p_usuario_id INT,
    p_alias VARCHAR
) RETURNS BOOL AS $$
BEGIN
    -- Insertar la nueva direccion en la tabla direcciones
    INSERT INTO datos_usuario.direcciones (direccion_completa, parroquia_fk, usuario_fk, alias)
    VALUES (p_direccion, p_parroquia_id, p_usuario_id, p_alias);

    -- Retornar verdadero si la insercion fue exitosa
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;