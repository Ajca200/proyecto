create or replace function datos_tienda.obtener_ultima_compra(
    p_usuario_id integer
)
returns table (
    r_id_orden integer,
    r_fecha timestamp with time zone, -- <<-- CORRECCIÓN AQUÍ: DEBE COINCIDIR CON LA CONSULTA INTERNA
    r_total numeric,
    r_estado varchar
) as $$
begin
    return query
    select 
        id_orden, 
        fecha::timestamp with time zone, -- Este es el tipo que se está devolviendo
        total, 
        estado 
    from 
        datos_tienda.ordenes
    where 
        usuario_fk = p_usuario_id
    order by 
        fecha desc
    limit 1;
end;
$$ language plpgsql;

select * from datos_tienda.obtener_ultima_compra(22);