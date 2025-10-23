create or replace function datos_tienda.registrar_items(
    p_orden_id integer,
    p_producto_id integer,
    p_cantidad integer,
    p_precio_u numeric
) returns boolean as $$
begin
    insert into datos_tienda.items_orden
        (
            orden_fk,
            producto_fk,
            cantidad,
            precio_unitario
        )
    values (
        p_orden_id,
        p_producto_id,
        p_cantidad,
        p_precio_u
    );

    return true;
end;
$$ language plpgsql;