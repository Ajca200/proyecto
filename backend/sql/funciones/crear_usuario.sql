CREATE OR REPLACE FUNCTION datos_usuario.crear_usuario(
    p_nombre VARCHAR,
    p_apellido VARCHAR,
    p_fecha_nacimiento DATE,
    p_correo VARCHAR,
    p_clave TEXT,
    p_rol INTEGER DEFAULT 2
)
RETURNS INTEGER 
LANGUAGE plpgsql AS $$
DECLARE
    v_usuario_id INTEGER;
BEGIN
    INSERT INTO datos_usuario.usuarios (
        nombre,
        apellido,
        fecha_nacimiento,
        correo,
        clave,
        rol_fk
    ) VALUES (
        p_nombre,
        p_apellido,
        p_fecha_nacimiento,
        p_correo,
        p_clave,
        p_rol
    ) RETURNING id_usuario INTO v_usuario_id;
    
    RETURN v_usuario_id;

EXCEPTION
    WHEN unique_violation THEN
        RAISE EXCEPTION 'El correo electrónico % ya está registrado.', p_correo USING ERRCODE = '23505';
END;
$$;