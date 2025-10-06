-- Funcion para obtener las direcciones permitidas de un usuario
CREATE OR REPLACE FUNCTION datos_usuario.obtener_direcciones_permitidas()
RETURNS TABLE (
    r_parroquia_id INT,
    r_parroquia VARCHAR,
    r_municipio_id INT,
    r_municipio VARCHAR,
    r_estado_id INT,
    r_estado VARCHAR
) 
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id_parroquia AS parroquia_id,
        p.nombre AS parroquia,
        m.id_municipio AS municipio_id,
        m.nombre AS municipio,
        e.id_estado AS estado_id,
        e.nombre AS estado
    FROM 
        datos_usuario.parroquias AS p
    JOIN 
        datos_usuario.municipios AS m ON p.municipio_fk = m.id_municipio
    JOIN 
        datos_usuario.estados AS e ON m.estado_fk = e.id_estado;
END;
$$ LANGUAGE plpgsql;

-- ejemplo de llamada a la funcion
SELECT * FROM datos_usuario.obtener_direcciones_permitidas();