CREATE OR REPLACE FUNCTION datos_usuario.eliminar_direccion_usuario(
    p_id_direccion INT,
    p_id_usuario INT
) RETURNS BOOLEAN AS $$
DECLARE
    filas_afectadas INT;
BEGIN
    -- Se cambia DELETE por UPDATE para establecer el estatus a 'I' (Inactivo)
    UPDATE datos_usuario.direcciones
    SET estatus = 'I'
    WHERE 
        id_direccion = p_id_direccion 
        AND usuario_fk = p_id_usuario
        AND estatus = 'A'; -- Opcional: Solo inactivar si el estatus actual es 'A' (Activo)

    GET DIAGNOSTICS filas_afectadas = ROW_COUNT;

    -- Si se modificó al menos una fila, la operación fue exitosa (la dirección fue inactivada)
    IF filas_afectadas > 0 THEN
        RETURN TRUE;
    ELSE
        -- Retorna FALSE si la dirección no existe, no pertenece al usuario o ya estaba inactiva.
        RETURN FALSE;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Captura cualquier otro error de la base de datos
        RAISE NOTICE 'Error al inactivar dirección: %', SQLERRM;
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql;
