-- La función es recreada para incluir los JOINs y cambiar el tipo de retorno de la dirección.
create or replace function datos_tienda.obtener_ordenes_usuario(
    usuario_id integer
)
returns table (
    r_id_orden integer,
    r_fecha timestamp with time zone,
    r_estado varchar,
    r_total numeric,
    r_direccion_envio text, -- Tipo cambiado de integer a text para almacenar la dirección formateada
    r_metodo_pago varchar,
    r_numero_referencia integer
) as $$
begin
    return query
    select 
        o.id_orden, 
        o.fecha::timestamp with time zone, 
        o.estado, 
        o.total, 
        -- Concatenación de la dirección completa, parroquia, municipio y estado
        CONCAT_WS(', ', d.direccion_completa, p.nombre, m.nombre, e.nombre) as r_direccion_envio,
        o.metodo_pago, 
        o.numero_referencia
    from 
        datos_tienda.ordenes o
    -- 1. JOIN a direcciones
    inner join datos_usuario.direcciones d on o.direccion_envio_fk = d.id_direccion
    -- 2. JOIN a parroquias (usando parroquia_fk de direcciones)
    inner join datos_usuario.parroquias p on d.parroquia_fk = p.id_parroquia
    -- 3. JOIN a municipios (usando municipio_fk de parroquias)
    inner join datos_usuario.municipios m on p.municipio_fk = m.id_municipio
    -- 4. JOIN a estados (usando estado_fk de municipios)
    inner join datos_usuario.estados e on m.estado_fk = e.id_estado
    where 
        o.usuario_fk = usuario_id
    order by 
        o.fecha desc;
end;
$$ language plpgsql;
