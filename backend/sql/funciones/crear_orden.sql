    CREATE OR REPLACE FUNCTION datos_tienda.crear_orden(
        p_usuario_id INTEGER,
        p_estado varchar,
        p_total numeric,
        p_direccion integer,
        p_comprobante varchar,
        p_metodo varchar,
        p_num_ref integer,
        p_correo_o varchar
    )
    RETURNS integer AS $$
    DECLARE
        v_orden_id INTEGER;
    BEGIN
        INSERT INTO datos_tienda.ordenes (
            usuario_fk,
            estado,
            total,
            direccion_envio_fk,
            comprobante_url,
            metodo,
            numero_referencia,
            correo_origen
        )
        VALUES (
            p_usuario_id,
            p_estado,
            p_total,
            p_direccion,
            p_comprobante,
            p_metodo,
            p_num_ref,
            p_correo_o
        )
        RETURNING id_orden INTO v_orden_id;

        RETURN v_orden_id;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE;
    END;
    $$ LANGUAGE plpgsql;
