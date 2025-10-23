CREATE OR REPLACE FUNCTION datos_usuario.editar_direccion_usuario(
    p_direccion_id integer,
    p_usuario integer,
    p_direccion_c text, -- completa
    p_parroquia integer,
    alias varchar
) 
RETURNS BOOL AS $$
BEGIN
    UPDATE datos_usuario.direcciones
    SET direccion_completa = p_direccion_c,
        parroquia_id = p_parroquia,
        alias = alias
    WHERE id = p_direccion_id
    AND usuario_id = p_usuario;

    IF FOUND THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;

END;
$$ LANGUAGE plpgsql;
