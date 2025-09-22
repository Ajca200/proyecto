CREATE OR REPLACE FUNCTION datos_usuario.login(p_correo VARCHAR)
RETURNS TABLE (
	r_clave TEXT,
	r_rol VARCHAR
)
LANGUAGE plpgsql AS $$
BEGIN
	RETURN QUERY
	SELECT usu.clave, rol.rol FROM datos_usuario.usuarios AS usu 
	JOIN datos_usuario.roles AS rol
		ON usu.rol_fk = rol.id_rol
	WHERE usu.correo = p_correo;
END;
$$;
