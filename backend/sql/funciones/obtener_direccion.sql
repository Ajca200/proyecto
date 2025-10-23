-- Funcion para obtener las direcciones ACTIVAS de un usuario
CREATE OR REPLACE FUNCTION datos_usuario.obtener_direcciones_por_usuario(p_usuario_id integer)
RETURNS TABLE (
    id_direccion integer,
    direccion_completa text,
    parroquia_fk integer,
    usuario_fk integer,
    mensaje text
) AS $$
BEGIN
    -- Retornar las direcciones del usuario con estatus 'A' (Activo)
    RETURN QUERY
    SELECT
        d.id_direccion,
        d.direccion_completa,
        d.parroquia_fk,
        d.usuario_fk,
        NULL::text AS mensaje
    FROM
        datos_usuario.direcciones d
    WHERE
        d.usuario_fk = p_usuario_id
        AND d.estatus = 'A'; -- ** Condición añadida para filtrar solo por direcciones activas 'A' **

    -- Verificar si se encontraron direcciones activas. Si no se encontraron filas,
    -- la función automáticamente continuará después de este bloque.
    IF NOT FOUND THEN
        -- Si la consulta anterior no retornó filas (el usuario no tiene direcciones activas),
        -- retornamos un registro indicando que no hay direcciones activas.
        RETURN QUERY
        SELECT NULL, NULL, NULL, NULL, 'El usuario no tiene direcciones activas registradas';
    END IF;

    -- Si se encontraron direcciones activas, el RETURN QUERY anterior ya las ha retornado
    -- y no es necesario un RETURN explícito.
END;
$$ LANGUAGE plpgsql;
