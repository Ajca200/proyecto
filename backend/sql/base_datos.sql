--
-- PostgreSQL database dump
--

\restrict BsFvEXVepLMDaXeanWNAM0R79GYZwObeAxO63lrkGgMyzD8aUh5sfVlaleE4FFb

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2025-09-22 16:51:50

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 7 (class 2615 OID 16886)
-- Name: datos_tienda; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA datos_tienda;


ALTER SCHEMA datos_tienda OWNER TO postgres;

--
-- TOC entry 5153 (class 0 OID 0)
-- Dependencies: 7
-- Name: SCHEMA datos_tienda; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA datos_tienda IS 'tabla para almacenar todos los datos de la tienda';


--
-- TOC entry 6 (class 2615 OID 16885)
-- Name: datos_usuario; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA datos_usuario;


ALTER SCHEMA datos_usuario OWNER TO postgres;

--
-- TOC entry 5154 (class 0 OID 0)
-- Dependencies: 6
-- Name: SCHEMA datos_usuario; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA datos_usuario IS 'esquema para almacenar todos los datos necesarios del usuario';


--
-- TOC entry 262 (class 1255 OID 17200)
-- Name: crear_usuario(character varying, character varying, date, character varying, text, integer); Type: FUNCTION; Schema: datos_usuario; Owner: postgres
--

CREATE FUNCTION datos_usuario.crear_usuario(p_nombre character varying, p_apellido character varying, p_fecha_nacimiento date, p_correo character varying, p_clave text, p_rol integer DEFAULT 2) RETURNS integer
    LANGUAGE plpgsql
    AS $$
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


ALTER FUNCTION datos_usuario.crear_usuario(p_nombre character varying, p_apellido character varying, p_fecha_nacimiento date, p_correo character varying, p_clave text, p_rol integer) OWNER TO postgres;

--
-- TOC entry 263 (class 1255 OID 17201)
-- Name: login(character varying); Type: FUNCTION; Schema: datos_usuario; Owner: postgres
--

CREATE FUNCTION datos_usuario.login(p_correo character varying) RETURNS TABLE(r_clave text, r_rol character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
	RETURN QUERY
	SELECT usu.clave, rol.rol FROM datos_usuario.usuarios AS usu 
	JOIN datos_usuario.roles AS rol
		ON usu.rol_fk = rol.id_rol
	WHERE usu.correo = p_correo;
END;
$$;


ALTER FUNCTION datos_usuario.login(p_correo character varying) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 236 (class 1259 OID 16955)
-- Name: carritos; Type: TABLE; Schema: datos_tienda; Owner: postgres
--

CREATE TABLE datos_tienda.carritos (
    id_carrito integer NOT NULL,
    usuario_fk integer NOT NULL
);


ALTER TABLE datos_tienda.carritos OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16954)
-- Name: carritos_id_carrito_seq; Type: SEQUENCE; Schema: datos_tienda; Owner: postgres
--

CREATE SEQUENCE datos_tienda.carritos_id_carrito_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE datos_tienda.carritos_id_carrito_seq OWNER TO postgres;

--
-- TOC entry 5155 (class 0 OID 0)
-- Dependencies: 235
-- Name: carritos_id_carrito_seq; Type: SEQUENCE OWNED BY; Schema: datos_tienda; Owner: postgres
--

ALTER SEQUENCE datos_tienda.carritos_id_carrito_seq OWNED BY datos_tienda.carritos.id_carrito;


--
-- TOC entry 234 (class 1259 OID 16948)
-- Name: categorias; Type: TABLE; Schema: datos_tienda; Owner: postgres
--

CREATE TABLE datos_tienda.categorias (
    id_categoria integer NOT NULL,
    nombre character varying(50) NOT NULL
);


ALTER TABLE datos_tienda.categorias OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16947)
-- Name: categorias_id_categoria_seq; Type: SEQUENCE; Schema: datos_tienda; Owner: postgres
--

CREATE SEQUENCE datos_tienda.categorias_id_categoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE datos_tienda.categorias_id_categoria_seq OWNER TO postgres;

--
-- TOC entry 5156 (class 0 OID 0)
-- Dependencies: 233
-- Name: categorias_id_categoria_seq; Type: SEQUENCE OWNED BY; Schema: datos_tienda; Owner: postgres
--

ALTER SEQUENCE datos_tienda.categorias_id_categoria_seq OWNED BY datos_tienda.categorias.id_categoria;


--
-- TOC entry 238 (class 1259 OID 16964)
-- Name: items_carrito; Type: TABLE; Schema: datos_tienda; Owner: postgres
--

CREATE TABLE datos_tienda.items_carrito (
    id_item integer NOT NULL,
    carrito_fk integer NOT NULL,
    producto_fk integer NOT NULL,
    cantidad integer NOT NULL
);


ALTER TABLE datos_tienda.items_carrito OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16963)
-- Name: items_carrito_id_item_seq; Type: SEQUENCE; Schema: datos_tienda; Owner: postgres
--

CREATE SEQUENCE datos_tienda.items_carrito_id_item_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE datos_tienda.items_carrito_id_item_seq OWNER TO postgres;

--
-- TOC entry 5157 (class 0 OID 0)
-- Dependencies: 237
-- Name: items_carrito_id_item_seq; Type: SEQUENCE OWNED BY; Schema: datos_tienda; Owner: postgres
--

ALTER SEQUENCE datos_tienda.items_carrito_id_item_seq OWNED BY datos_tienda.items_carrito.id_item;


--
-- TOC entry 242 (class 1259 OID 16980)
-- Name: items_orden; Type: TABLE; Schema: datos_tienda; Owner: postgres
--

CREATE TABLE datos_tienda.items_orden (
    id_item_orden integer NOT NULL,
    orden_fk integer NOT NULL,
    producto_fk integer NOT NULL,
    cantidad integer NOT NULL,
    precio_unitario numeric NOT NULL
);


ALTER TABLE datos_tienda.items_orden OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 16979)
-- Name: items_orden_id_item_orden_seq; Type: SEQUENCE; Schema: datos_tienda; Owner: postgres
--

CREATE SEQUENCE datos_tienda.items_orden_id_item_orden_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE datos_tienda.items_orden_id_item_orden_seq OWNER TO postgres;

--
-- TOC entry 5158 (class 0 OID 0)
-- Dependencies: 241
-- Name: items_orden_id_item_orden_seq; Type: SEQUENCE OWNED BY; Schema: datos_tienda; Owner: postgres
--

ALTER SEQUENCE datos_tienda.items_orden_id_item_orden_seq OWNED BY datos_tienda.items_orden.id_item_orden;


--
-- TOC entry 240 (class 1259 OID 16971)
-- Name: ordenes; Type: TABLE; Schema: datos_tienda; Owner: postgres
--

CREATE TABLE datos_tienda.ordenes (
    id_orden integer NOT NULL,
    usuario_fk integer NOT NULL,
    fecha timestamp with time zone NOT NULL,
    estado character varying(50) NOT NULL,
    total numeric NOT NULL,
    direccion_envio_fk integer NOT NULL
);


ALTER TABLE datos_tienda.ordenes OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16970)
-- Name: ordenes_id_orden_seq; Type: SEQUENCE; Schema: datos_tienda; Owner: postgres
--

CREATE SEQUENCE datos_tienda.ordenes_id_orden_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE datos_tienda.ordenes_id_orden_seq OWNER TO postgres;

--
-- TOC entry 5159 (class 0 OID 0)
-- Dependencies: 239
-- Name: ordenes_id_orden_seq; Type: SEQUENCE OWNED BY; Schema: datos_tienda; Owner: postgres
--

ALTER SEQUENCE datos_tienda.ordenes_id_orden_seq OWNED BY datos_tienda.ordenes.id_orden;


--
-- TOC entry 232 (class 1259 OID 16939)
-- Name: productos; Type: TABLE; Schema: datos_tienda; Owner: postgres
--

CREATE TABLE datos_tienda.productos (
    id_producto integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion text NOT NULL,
    stock integer NOT NULL,
    precio numeric NOT NULL,
    imagen_url character varying(150),
    categoria_fk integer NOT NULL
);


ALTER TABLE datos_tienda.productos OWNER TO postgres;

--
-- TOC entry 5160 (class 0 OID 0)
-- Dependencies: 232
-- Name: TABLE productos; Type: COMMENT; Schema: datos_tienda; Owner: postgres
--

COMMENT ON TABLE datos_tienda.productos IS 'esquema para almacenar todos los datos mane';


--
-- TOC entry 231 (class 1259 OID 16938)
-- Name: productos_id_producto_seq; Type: SEQUENCE; Schema: datos_tienda; Owner: postgres
--

CREATE SEQUENCE datos_tienda.productos_id_producto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE datos_tienda.productos_id_producto_seq OWNER TO postgres;

--
-- TOC entry 5161 (class 0 OID 0)
-- Dependencies: 231
-- Name: productos_id_producto_seq; Type: SEQUENCE OWNED BY; Schema: datos_tienda; Owner: postgres
--

ALTER SEQUENCE datos_tienda.productos_id_producto_seq OWNED BY datos_tienda.productos.id_producto;


--
-- TOC entry 230 (class 1259 OID 16929)
-- Name: direcciones; Type: TABLE; Schema: datos_usuario; Owner: postgres
--

CREATE TABLE datos_usuario.direcciones (
    id_direccion integer NOT NULL,
    direccion_completa text NOT NULL,
    parroquia_fk integer NOT NULL,
    usuario_fk integer NOT NULL
);


ALTER TABLE datos_usuario.direcciones OWNER TO postgres;

--
-- TOC entry 5162 (class 0 OID 0)
-- Dependencies: 230
-- Name: TABLE direcciones; Type: COMMENT; Schema: datos_usuario; Owner: postgres
--

COMMENT ON TABLE datos_usuario.direcciones IS 'tabla para almacenar las multiples direcciones de los usuarios';


--
-- TOC entry 5163 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN direcciones.usuario_fk; Type: COMMENT; Schema: datos_usuario; Owner: postgres
--

COMMENT ON COLUMN datos_usuario.direcciones.usuario_fk IS 'mapo para definir el usuario asignado a la direccion';


--
-- TOC entry 229 (class 1259 OID 16928)
-- Name: direcciones_id_direccion_seq; Type: SEQUENCE; Schema: datos_usuario; Owner: postgres
--

CREATE SEQUENCE datos_usuario.direcciones_id_direccion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE datos_usuario.direcciones_id_direccion_seq OWNER TO postgres;

--
-- TOC entry 5164 (class 0 OID 0)
-- Dependencies: 229
-- Name: direcciones_id_direccion_seq; Type: SEQUENCE OWNED BY; Schema: datos_usuario; Owner: postgres
--

ALTER SEQUENCE datos_usuario.direcciones_id_direccion_seq OWNED BY datos_usuario.direcciones.id_direccion;


--
-- TOC entry 224 (class 1259 OID 16908)
-- Name: estados; Type: TABLE; Schema: datos_usuario; Owner: postgres
--

CREATE TABLE datos_usuario.estados (
    id_estado integer NOT NULL,
    nombre character varying(100) NOT NULL
);


ALTER TABLE datos_usuario.estados OWNER TO postgres;

--
-- TOC entry 5165 (class 0 OID 0)
-- Dependencies: 224
-- Name: TABLE estados; Type: COMMENT; Schema: datos_usuario; Owner: postgres
--

COMMENT ON TABLE datos_usuario.estados IS 'tabla para almacenar los estados (ubicacion) registrados en el sistema';


--
-- TOC entry 5166 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN estados.nombre; Type: COMMENT; Schema: datos_usuario; Owner: postgres
--

COMMENT ON COLUMN datos_usuario.estados.nombre IS 'nombre del estado, ej: Tachira';


--
-- TOC entry 223 (class 1259 OID 16907)
-- Name: estados_id_estado_seq; Type: SEQUENCE; Schema: datos_usuario; Owner: postgres
--

CREATE SEQUENCE datos_usuario.estados_id_estado_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE datos_usuario.estados_id_estado_seq OWNER TO postgres;

--
-- TOC entry 5167 (class 0 OID 0)
-- Dependencies: 223
-- Name: estados_id_estado_seq; Type: SEQUENCE OWNED BY; Schema: datos_usuario; Owner: postgres
--

ALTER SEQUENCE datos_usuario.estados_id_estado_seq OWNED BY datos_usuario.estados.id_estado;


--
-- TOC entry 226 (class 1259 OID 16915)
-- Name: municipios; Type: TABLE; Schema: datos_usuario; Owner: postgres
--

CREATE TABLE datos_usuario.municipios (
    id_municipio integer NOT NULL,
    nombre character varying(100) NOT NULL,
    estado_fk integer NOT NULL
);


ALTER TABLE datos_usuario.municipios OWNER TO postgres;

--
-- TOC entry 5168 (class 0 OID 0)
-- Dependencies: 226
-- Name: TABLE municipios; Type: COMMENT; Schema: datos_usuario; Owner: postgres
--

COMMENT ON TABLE datos_usuario.municipios IS 'tabla para almacenar los municipios con sus respectivos estados';


--
-- TOC entry 225 (class 1259 OID 16914)
-- Name: municipios_id_municipio_seq; Type: SEQUENCE; Schema: datos_usuario; Owner: postgres
--

CREATE SEQUENCE datos_usuario.municipios_id_municipio_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE datos_usuario.municipios_id_municipio_seq OWNER TO postgres;

--
-- TOC entry 5169 (class 0 OID 0)
-- Dependencies: 225
-- Name: municipios_id_municipio_seq; Type: SEQUENCE OWNED BY; Schema: datos_usuario; Owner: postgres
--

ALTER SEQUENCE datos_usuario.municipios_id_municipio_seq OWNED BY datos_usuario.municipios.id_municipio;


--
-- TOC entry 228 (class 1259 OID 16922)
-- Name: parroquias; Type: TABLE; Schema: datos_usuario; Owner: postgres
--

CREATE TABLE datos_usuario.parroquias (
    id_parroquia integer NOT NULL,
    nombre character varying(100) NOT NULL,
    municipio_fk integer NOT NULL
);


ALTER TABLE datos_usuario.parroquias OWNER TO postgres;

--
-- TOC entry 5170 (class 0 OID 0)
-- Dependencies: 228
-- Name: TABLE parroquias; Type: COMMENT; Schema: datos_usuario; Owner: postgres
--

COMMENT ON TABLE datos_usuario.parroquias IS 'tabla para almacenar las parroquias registradas con su respectivo municipio';


--
-- TOC entry 227 (class 1259 OID 16921)
-- Name: parroquias_id_parroquia_seq; Type: SEQUENCE; Schema: datos_usuario; Owner: postgres
--

CREATE SEQUENCE datos_usuario.parroquias_id_parroquia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE datos_usuario.parroquias_id_parroquia_seq OWNER TO postgres;

--
-- TOC entry 5171 (class 0 OID 0)
-- Dependencies: 227
-- Name: parroquias_id_parroquia_seq; Type: SEQUENCE OWNED BY; Schema: datos_usuario; Owner: postgres
--

ALTER SEQUENCE datos_usuario.parroquias_id_parroquia_seq OWNED BY datos_usuario.parroquias.id_parroquia;


--
-- TOC entry 220 (class 1259 OID 16888)
-- Name: roles; Type: TABLE; Schema: datos_usuario; Owner: postgres
--

CREATE TABLE datos_usuario.roles (
    id_rol integer NOT NULL,
    rol character varying(50) NOT NULL,
    descripcion text
);


ALTER TABLE datos_usuario.roles OWNER TO postgres;

--
-- TOC entry 5172 (class 0 OID 0)
-- Dependencies: 220
-- Name: TABLE roles; Type: COMMENT; Schema: datos_usuario; Owner: postgres
--

COMMENT ON TABLE datos_usuario.roles IS 'datos basicos de usuario';


--
-- TOC entry 5173 (class 0 OID 0)
-- Dependencies: 220
-- Name: COLUMN roles.id_rol; Type: COMMENT; Schema: datos_usuario; Owner: postgres
--

COMMENT ON COLUMN datos_usuario.roles.id_rol IS 'identificador unico de usuario';


--
-- TOC entry 5174 (class 0 OID 0)
-- Dependencies: 220
-- Name: COLUMN roles.rol; Type: COMMENT; Schema: datos_usuario; Owner: postgres
--

COMMENT ON COLUMN datos_usuario.roles.rol IS 'rol a asignar a usuarios';


--
-- TOC entry 219 (class 1259 OID 16887)
-- Name: roles_id_rol_seq; Type: SEQUENCE; Schema: datos_usuario; Owner: postgres
--

CREATE SEQUENCE datos_usuario.roles_id_rol_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE datos_usuario.roles_id_rol_seq OWNER TO postgres;

--
-- TOC entry 5175 (class 0 OID 0)
-- Dependencies: 219
-- Name: roles_id_rol_seq; Type: SEQUENCE OWNED BY; Schema: datos_usuario; Owner: postgres
--

ALTER SEQUENCE datos_usuario.roles_id_rol_seq OWNED BY datos_usuario.roles.id_rol;


--
-- TOC entry 222 (class 1259 OID 16897)
-- Name: usuarios; Type: TABLE; Schema: datos_usuario; Owner: postgres
--

CREATE TABLE datos_usuario.usuarios (
    id_usuario integer NOT NULL,
    nombre character varying(50) NOT NULL,
    apellido character varying(50) NOT NULL,
    fecha_nacimiento date NOT NULL,
    correo character varying(100) NOT NULL,
    clave text NOT NULL,
    rol_fk integer NOT NULL,
    codigo_seguridad numeric(6,0)[]
);


ALTER TABLE datos_usuario.usuarios OWNER TO postgres;

--
-- TOC entry 5176 (class 0 OID 0)
-- Dependencies: 222
-- Name: TABLE usuarios; Type: COMMENT; Schema: datos_usuario; Owner: postgres
--

COMMENT ON TABLE datos_usuario.usuarios IS 'datos basicos del usuario';


--
-- TOC entry 5177 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN usuarios.rol_fk; Type: COMMENT; Schema: datos_usuario; Owner: postgres
--

COMMENT ON COLUMN datos_usuario.usuarios.rol_fk IS 'rol asignado al usuario';


--
-- TOC entry 221 (class 1259 OID 16896)
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE; Schema: datos_usuario; Owner: postgres
--

CREATE SEQUENCE datos_usuario.usuarios_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE datos_usuario.usuarios_id_usuario_seq OWNER TO postgres;

--
-- TOC entry 5178 (class 0 OID 0)
-- Dependencies: 221
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: datos_usuario; Owner: postgres
--

ALTER SEQUENCE datos_usuario.usuarios_id_usuario_seq OWNED BY datos_usuario.usuarios.id_usuario;


--
-- TOC entry 250 (class 1259 OID 17076)
-- Name: auth_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_group (
    id integer NOT NULL,
    name character varying(150) NOT NULL
);


ALTER TABLE public.auth_group OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 17075)
-- Name: auth_group_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.auth_group ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 252 (class 1259 OID 17084)
-- Name: auth_group_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_group_permissions (
    id bigint NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.auth_group_permissions OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 17083)
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.auth_group_permissions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_group_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 248 (class 1259 OID 17070)
-- Name: auth_permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_permission (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);


ALTER TABLE public.auth_permission OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 17069)
-- Name: auth_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.auth_permission ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_permission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 254 (class 1259 OID 17090)
-- Name: auth_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_user (
    id integer NOT NULL,
    password character varying(128) NOT NULL,
    last_login timestamp with time zone,
    is_superuser boolean NOT NULL,
    username character varying(150) NOT NULL,
    first_name character varying(150) NOT NULL,
    last_name character varying(150) NOT NULL,
    email character varying(254) NOT NULL,
    is_staff boolean NOT NULL,
    is_active boolean NOT NULL,
    date_joined timestamp with time zone NOT NULL
);


ALTER TABLE public.auth_user OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 17098)
-- Name: auth_user_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_user_groups (
    id bigint NOT NULL,
    user_id integer NOT NULL,
    group_id integer NOT NULL
);


ALTER TABLE public.auth_user_groups OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 17097)
-- Name: auth_user_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.auth_user_groups ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_user_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 253 (class 1259 OID 17089)
-- Name: auth_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.auth_user ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 258 (class 1259 OID 17104)
-- Name: auth_user_user_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_user_user_permissions (
    id bigint NOT NULL,
    user_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.auth_user_user_permissions OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 17103)
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.auth_user_user_permissions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_user_user_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 260 (class 1259 OID 17162)
-- Name: django_admin_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.django_admin_log (
    id integer NOT NULL,
    action_time timestamp with time zone NOT NULL,
    object_id text,
    object_repr character varying(200) NOT NULL,
    action_flag smallint NOT NULL,
    change_message text NOT NULL,
    content_type_id integer,
    user_id integer NOT NULL,
    CONSTRAINT django_admin_log_action_flag_check CHECK ((action_flag >= 0))
);


ALTER TABLE public.django_admin_log OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 17161)
-- Name: django_admin_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.django_admin_log ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_admin_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 246 (class 1259 OID 17062)
-- Name: django_content_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.django_content_type (
    id integer NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);


ALTER TABLE public.django_content_type OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 17061)
-- Name: django_content_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.django_content_type ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_content_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 244 (class 1259 OID 17054)
-- Name: django_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.django_migrations (
    id bigint NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);


ALTER TABLE public.django_migrations OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 17053)
-- Name: django_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.django_migrations ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_migrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 261 (class 1259 OID 17190)
-- Name: django_session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);


ALTER TABLE public.django_session OWNER TO postgres;

--
-- TOC entry 4858 (class 2604 OID 16958)
-- Name: carritos id_carrito; Type: DEFAULT; Schema: datos_tienda; Owner: postgres
--

ALTER TABLE ONLY datos_tienda.carritos ALTER COLUMN id_carrito SET DEFAULT nextval('datos_tienda.carritos_id_carrito_seq'::regclass);


--
-- TOC entry 4857 (class 2604 OID 16951)
-- Name: categorias id_categoria; Type: DEFAULT; Schema: datos_tienda; Owner: postgres
--

ALTER TABLE ONLY datos_tienda.categorias ALTER COLUMN id_categoria SET DEFAULT nextval('datos_tienda.categorias_id_categoria_seq'::regclass);


--
-- TOC entry 4859 (class 2604 OID 16967)
-- Name: items_carrito id_item; Type: DEFAULT; Schema: datos_tienda; Owner: postgres
--

ALTER TABLE ONLY datos_tienda.items_carrito ALTER COLUMN id_item SET DEFAULT nextval('datos_tienda.items_carrito_id_item_seq'::regclass);


--
-- TOC entry 4861 (class 2604 OID 16983)
-- Name: items_orden id_item_orden; Type: DEFAULT; Schema: datos_tienda; Owner: postgres
--

ALTER TABLE ONLY datos_tienda.items_orden ALTER COLUMN id_item_orden SET DEFAULT nextval('datos_tienda.items_orden_id_item_orden_seq'::regclass);


--
-- TOC entry 4860 (class 2604 OID 16974)
-- Name: ordenes id_orden; Type: DEFAULT; Schema: datos_tienda; Owner: postgres
--

ALTER TABLE ONLY datos_tienda.ordenes ALTER COLUMN id_orden SET DEFAULT nextval('datos_tienda.ordenes_id_orden_seq'::regclass);


--
-- TOC entry 4856 (class 2604 OID 16942)
-- Name: productos id_producto; Type: DEFAULT; Schema: datos_tienda; Owner: postgres
--

ALTER TABLE ONLY datos_tienda.productos ALTER COLUMN id_producto SET DEFAULT nextval('datos_tienda.productos_id_producto_seq'::regclass);


--
-- TOC entry 4855 (class 2604 OID 16932)
-- Name: direcciones id_direccion; Type: DEFAULT; Schema: datos_usuario; Owner: postgres
--

ALTER TABLE ONLY datos_usuario.direcciones ALTER COLUMN id_direccion SET DEFAULT nextval('datos_usuario.direcciones_id_direccion_seq'::regclass);


--
-- TOC entry 4852 (class 2604 OID 16911)
-- Name: estados id_estado; Type: DEFAULT; Schema: datos_usuario; Owner: postgres
--

ALTER TABLE ONLY datos_usuario.estados ALTER COLUMN id_estado SET DEFAULT nextval('datos_usuario.estados_id_estado_seq'::regclass);


--
-- TOC entry 4853 (class 2604 OID 16918)
-- Name: municipios id_municipio; Type: DEFAULT; Schema: datos_usuario; Owner: postgres
--

ALTER TABLE ONLY datos_usuario.municipios ALTER COLUMN id_municipio SET DEFAULT nextval('datos_usuario.municipios_id_municipio_seq'::regclass);


--
-- TOC entry 4854 (class 2604 OID 16925)
-- Name: parroquias id_parroquia; Type: DEFAULT; Schema: datos_usuario; Owner: postgres
--

ALTER TABLE ONLY datos_usuario.parroquias ALTER COLUMN id_parroquia SET DEFAULT nextval('datos_usuario.parroquias_id_parroquia_seq'::regclass);


--
-- TOC entry 4850 (class 2604 OID 16891)
-- Name: roles id_rol; Type: DEFAULT; Schema: datos_usuario; Owner: postgres
--

ALTER TABLE ONLY datos_usuario.roles ALTER COLUMN id_rol SET DEFAULT nextval('datos_usuario.roles_id_rol_seq'::regclass);


--
-- TOC entry 4851 (class 2604 OID 16900)
-- Name: usuarios id_usuario; Type: DEFAULT; Schema: datos_usuario; Owner: postgres
--

ALTER TABLE ONLY datos_usuario.usuarios ALTER COLUMN id_usuario SET DEFAULT nextval('datos_usuario.usuarios_id_usuario_seq'::regclass);


--
-- TOC entry 5122 (class 0 OID 16955)
-- Dependencies: 236
-- Data for Name: carritos; Type: TABLE DATA; Schema: datos_tienda; Owner: postgres
--

COPY datos_tienda.carritos (id_carrito, usuario_fk) FROM stdin;
\.


--
-- TOC entry 5120 (class 0 OID 16948)
-- Dependencies: 234
-- Data for Name: categorias; Type: TABLE DATA; Schema: datos_tienda; Owner: postgres
--

COPY datos_tienda.categorias (id_categoria, nombre) FROM stdin;
\.


--
-- TOC entry 5124 (class 0 OID 16964)
-- Dependencies: 238
-- Data for Name: items_carrito; Type: TABLE DATA; Schema: datos_tienda; Owner: postgres
--

COPY datos_tienda.items_carrito (id_item, carrito_fk, producto_fk, cantidad) FROM stdin;
\.


--
-- TOC entry 5128 (class 0 OID 16980)
-- Dependencies: 242
-- Data for Name: items_orden; Type: TABLE DATA; Schema: datos_tienda; Owner: postgres
--

COPY datos_tienda.items_orden (id_item_orden, orden_fk, producto_fk, cantidad, precio_unitario) FROM stdin;
\.


--
-- TOC entry 5126 (class 0 OID 16971)
-- Dependencies: 240
-- Data for Name: ordenes; Type: TABLE DATA; Schema: datos_tienda; Owner: postgres
--

COPY datos_tienda.ordenes (id_orden, usuario_fk, fecha, estado, total, direccion_envio_fk) FROM stdin;
\.


--
-- TOC entry 5118 (class 0 OID 16939)
-- Dependencies: 232
-- Data for Name: productos; Type: TABLE DATA; Schema: datos_tienda; Owner: postgres
--

COPY datos_tienda.productos (id_producto, nombre, descripcion, stock, precio, imagen_url, categoria_fk) FROM stdin;
\.


--
-- TOC entry 5116 (class 0 OID 16929)
-- Dependencies: 230
-- Data for Name: direcciones; Type: TABLE DATA; Schema: datos_usuario; Owner: postgres
--

COPY datos_usuario.direcciones (id_direccion, direccion_completa, parroquia_fk, usuario_fk) FROM stdin;
\.


--
-- TOC entry 5110 (class 0 OID 16908)
-- Dependencies: 224
-- Data for Name: estados; Type: TABLE DATA; Schema: datos_usuario; Owner: postgres
--

COPY datos_usuario.estados (id_estado, nombre) FROM stdin;
\.


--
-- TOC entry 5112 (class 0 OID 16915)
-- Dependencies: 226
-- Data for Name: municipios; Type: TABLE DATA; Schema: datos_usuario; Owner: postgres
--

COPY datos_usuario.municipios (id_municipio, nombre, estado_fk) FROM stdin;
\.


--
-- TOC entry 5114 (class 0 OID 16922)
-- Dependencies: 228
-- Data for Name: parroquias; Type: TABLE DATA; Schema: datos_usuario; Owner: postgres
--

COPY datos_usuario.parroquias (id_parroquia, nombre, municipio_fk) FROM stdin;
\.


--
-- TOC entry 5106 (class 0 OID 16888)
-- Dependencies: 220
-- Data for Name: roles; Type: TABLE DATA; Schema: datos_usuario; Owner: postgres
--

COPY datos_usuario.roles (id_rol, rol, descripcion) FROM stdin;
1	admin	\N
2	cliente	\N
\.


--
-- TOC entry 5108 (class 0 OID 16897)
-- Dependencies: 222
-- Data for Name: usuarios; Type: TABLE DATA; Schema: datos_usuario; Owner: postgres
--

COPY datos_usuario.usuarios (id_usuario, nombre, apellido, fecha_nacimiento, correo, clave, rol_fk, codigo_seguridad) FROM stdin;
22	abrahan	colmenares	2000-04-16	colmenaresabrahan5f@gmail.com	pbkdf2_sha256$1000000$w6CshlAPgTbSdD9xzKhAnk$QW3D7bcU/0tRNTyP6QueoZ2LvoWF7eYs1hbIeYdBAcg=	2	\N
23	mayre	melendez	2005-09-16	mayreross@gmail.com	pbkdf2_sha256$1000000$ixz5q6y5jVNOWS4FYKF3Hk$or8m5K5K+pEYmkJ/25i5O06yx+pB9cPAu6M/Pd0Pmdk=	2	\N
\.


--
-- TOC entry 5136 (class 0 OID 17076)
-- Dependencies: 250
-- Data for Name: auth_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_group (id, name) FROM stdin;
\.


--
-- TOC entry 5138 (class 0 OID 17084)
-- Dependencies: 252
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_group_permissions (id, group_id, permission_id) FROM stdin;
\.


--
-- TOC entry 5134 (class 0 OID 17070)
-- Dependencies: 248
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_permission (id, name, content_type_id, codename) FROM stdin;
1	Can add log entry	1	add_logentry
2	Can change log entry	1	change_logentry
3	Can delete log entry	1	delete_logentry
4	Can view log entry	1	view_logentry
5	Can add permission	2	add_permission
6	Can change permission	2	change_permission
7	Can delete permission	2	delete_permission
8	Can view permission	2	view_permission
9	Can add group	3	add_group
10	Can change group	3	change_group
11	Can delete group	3	delete_group
12	Can view group	3	view_group
13	Can add user	4	add_user
14	Can change user	4	change_user
15	Can delete user	4	delete_user
16	Can view user	4	view_user
17	Can add content type	5	add_contenttype
18	Can change content type	5	change_contenttype
19	Can delete content type	5	delete_contenttype
20	Can view content type	5	view_contenttype
21	Can add session	6	add_session
22	Can change session	6	change_session
23	Can delete session	6	delete_session
24	Can view session	6	view_session
\.


--
-- TOC entry 5140 (class 0 OID 17090)
-- Dependencies: 254
-- Data for Name: auth_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined) FROM stdin;
\.


--
-- TOC entry 5142 (class 0 OID 17098)
-- Dependencies: 256
-- Data for Name: auth_user_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_user_groups (id, user_id, group_id) FROM stdin;
\.


--
-- TOC entry 5144 (class 0 OID 17104)
-- Dependencies: 258
-- Data for Name: auth_user_user_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_user_user_permissions (id, user_id, permission_id) FROM stdin;
\.


--
-- TOC entry 5146 (class 0 OID 17162)
-- Dependencies: 260
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.django_admin_log (id, action_time, object_id, object_repr, action_flag, change_message, content_type_id, user_id) FROM stdin;
\.


--
-- TOC entry 5132 (class 0 OID 17062)
-- Dependencies: 246
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.django_content_type (id, app_label, model) FROM stdin;
1	admin	logentry
2	auth	permission
3	auth	group
4	auth	user
5	contenttypes	contenttype
6	sessions	session
\.


--
-- TOC entry 5130 (class 0 OID 17054)
-- Dependencies: 244
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.django_migrations (id, app, name, applied) FROM stdin;
1	contenttypes	0001_initial	2025-09-16 13:04:05.060597-04
2	auth	0001_initial	2025-09-16 13:04:05.174839-04
3	admin	0001_initial	2025-09-16 13:04:05.209586-04
4	admin	0002_logentry_remove_auto_add	2025-09-16 13:04:05.220241-04
5	admin	0003_logentry_add_action_flag_choices	2025-09-16 13:04:05.23098-04
6	contenttypes	0002_remove_content_type_name	2025-09-16 13:04:05.260401-04
7	auth	0002_alter_permission_name_max_length	2025-09-16 13:04:05.27209-04
8	auth	0003_alter_user_email_max_length	2025-09-16 13:04:05.282206-04
9	auth	0004_alter_user_username_opts	2025-09-16 13:04:05.293115-04
10	auth	0005_alter_user_last_login_null	2025-09-16 13:04:05.306793-04
11	auth	0006_require_contenttypes_0002	2025-09-16 13:04:05.308473-04
12	auth	0007_alter_validators_add_error_messages	2025-09-16 13:04:05.319192-04
13	auth	0008_alter_user_username_max_length	2025-09-16 13:04:05.342489-04
14	auth	0009_alter_user_last_name_max_length	2025-09-16 13:04:05.355853-04
15	auth	0010_alter_group_name_max_length	2025-09-16 13:04:05.372941-04
16	auth	0011_update_proxy_permissions	2025-09-16 13:04:05.384266-04
17	auth	0012_alter_user_first_name_max_length	2025-09-16 13:04:05.395318-04
18	sessions	0001_initial	2025-09-16 13:04:05.412718-04
\.


--
-- TOC entry 5147 (class 0 OID 17190)
-- Dependencies: 261
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.django_session (session_key, session_data, expire_date) FROM stdin;
00dnk8ob166vgrg9umq3vnn53ril9c9j	.eJwVi80KgzAMgN8l5yltNVV78iF2H1lWNWAbqTCEsXffev1-PsD6klUf71hkESYWzRDA9RaHCW4QE8n-B6x7iplKPOlZaKOMy7xW17Km2l2HFKqncdiYqbH-bodgxtBhi87b3sP3B_DnIcs:1uycl1:DZucw_RxZHtauwif80AI9oRA7z4StvrVthuq69jmh_k	2025-09-30 16:58:35.615289-04
0k7tj2nafl8p36eutk52ry5b627f1cby	eyJjb2RpZ29fdmVyaWZpY2FjaW9uIjoiODI0NDc4IiwiZXhwaXJhIjoiMjAyNS0wOS0xN1QwMToyNToyOS40NzA4NzcifQ:1uykVt:W_tPa9TGqAfmzsznOQfztHBDzhnXEtKU9oYOLUHc1Rw	2025-10-01 01:15:29.566848-04
7y9oyekfjhp3vnqpfuzl3vdsvp1rxrsr	eyJjb2RpZ29fdmVyaWZpY2FjaW9uIjoiMjM4MTA1IiwiZXhwaXJhIjoiMjAyNS0wOS0xN1QwMToyOToyNy4zMzA2MDAifQ:1uykZj:sqDqX_gEfdey65nyjf9cP_NG-iSDvIYKcKeLv9rplm0	2025-10-01 01:19:27.403188-04
60sxc2rk2zoxoh72f9bb0j7cndg2jz0d	eyJjb2RpZ29fdmVyaWZpY2FjaW9uIjoiODM1NzQ3IiwiZXhwaXJhIjoiMjAyNS0wOS0xN1QxOToxNDo1OS40MzMwMDMifQ:1uz1Ct:XzDZenz_YDHf4NX1_xDRLix1XpzzLO6Wheem_I9kyq8	2025-10-01 19:04:59.643018-04
mkeek1wvkvspe7jzot1to4wuwmxem2u0	eyJjb2RpZ29fdmVyaWZpY2FjaW9uIjoiMTAxNzY0IiwiZXhwaXJhIjoiMjAyNS0wOS0xN1QxOToyNzozMS41OTU2NjMifQ:1uz1P1:D-C86ypA8xF3NuWZk5ZmfKRPbjjWYYnlHjKaNbTEHEo	2025-10-01 19:17:31.712108-04
6u8omu87v919gqazjdqvhmfuwj3o1ct0	eyJjb2RpZ29fdmVyaWZpY2FjaW9uIjoiMzU5NDkxIiwiZXhwaXJhIjoiMjAyNS0wOS0xN1QxOTozNTo1NC4zNzAyMTEifQ:1uz1X8:DtTdpLaO2o6KBEWdEGkhghIIoDXfNi2LIX9245I9yTI	2025-10-01 19:25:54.476812-04
aecmol9ko7wxgz0u2z6xevxensk7pli0	eyJjb2RpZ29fdmVyaWZpY2FjaW9uIjoiMjUyNzAwIiwiZXhwaXJhIjoiMjAyNS0wOS0xN1QxOTozNzo1OS40MTQxNzgifQ:1uz1Z9:jSU12swdViAiZCxvPer6hOkKVz67qhuQOAx_dGbEDHM	2025-10-01 19:27:59.486253-04
nzv3edtnplnsrjxjht78eun8nhfzp5mk	eyJjb2RpZ29fdmVyaWZpY2FjaW9uIjoiMzQxNzAyIiwiZXhwaXJhIjoiMjAyNS0wOS0xN1QxOTozOToyMi42MjY4MTUifQ:1uz1aU:PacBfwLQPzY_oB37S34qGtrNEX_blJR5Kj_ZHfUp710	2025-10-01 19:29:22.725868-04
d731ggoik5js8i8w6d83npyens2qt4a4	eyJjb2RpZ29fdmVyaWZpY2FjaW9uIjoiNDI0MjQ5IiwiZXhwaXJhIjoiMjAyNS0wOS0xN1QxOTo0MDo0Ni4xMTA4NzcifQ:1uz1bq:21PECucGw8CNsbBSIoaLjWdZLO68WTh5QHvbqTRWxp4	2025-10-01 19:30:46.216728-04
p03n3wmzm0jxaxom9ri150vwexpky1cx	eyJjb2RpZ29fdmVyaWZpY2FjaW9uIjoiNjEwMDE0IiwiZXhwaXJhIjoiMjAyNS0wOS0xN1QxOTo0NTo0MS4wMzIzOTUifQ:1uz1gb:06_e8lJEvYL3pUeZ6XmfVTEcRpso5Bl4JxMne6Ned2g	2025-10-01 19:35:41.117296-04
9o098ynup2nigrmv9uig9yrv72m0jbk8	eyJjb2RpZ29fdmVyaWZpY2FjaW9uIjoiMTQ1MTYxIiwiZXhwaXJhIjoiMjAyNS0wOS0xN1QyMDowOToxMC4yNTY4MzEifQ:1uz23K:RPbV8AfAHzpLoHJ8KqPfb3SPhU-8v_TwLfvsrzo6mpk	2025-10-01 19:59:10.356965-04
o6k1gq7jw1065xa1g0bj919o6e3xhcuf	eyJjb2RpZ29fdmVyaWZpY2FjaW9uIjoiMjQ2NjQ2IiwiZXhwaXJhIjoiMjAyNS0wOS0xN1QyMDoxMDo1My4zMDgyMDYifQ:1uz24z:9WAtC46DK8iZ4yG6434ITSAxYP-8z58oOfqvhUL7KX0	2025-10-01 20:00:53.410532-04
vt9dtjtpax5ezap984csd6g62lodsc8o	eyJjb2RpZ29fdmVyaWZpY2FjaW9uIjoiMDQ5ODQwIiwiZXhwaXJhIjoiMjAyNS0wOS0xN1QyMDoxMjozOC4yOTE5NDcifQ:1uz26g:TB1q3wRqf0-L1vuLCpEE3WxxZ9KmV1Wm3uqAQ0hEoFY	2025-10-01 20:02:38.391708-04
k9p6enpdgjjnmuuf0rpe5vaws0f3120n	.eJwVykkKgDAMQNG7ZK3Sxgm78hBeIErUQgeJFgTx7tbd4_MfSGcisRHMA0sU4awM5zmQ8Emz0E6hXcfNk3XVEj0UINH9l7McLoa3AL4PK5QbKmxLNZSoJ6xN0xvUVVerRiO8H_YnIek:1v0X3J:JQXRrehsDuK_j273y0GUHKoWeOJdJ4t_DxXLVTyF1Y0	2025-10-05 23:17:21.639731-04
sp82eqxhqqgqtj4phtobqv6fojy70ppt	.eJwVyk0OQDAQQOG7zBqpoURXDuECQwZN-iNDE4m4u9p9eXkPpDOR2AjmgSWKcFaG8xxI-KRZaKeg13HzZF21RA8FSHT_5SyHi-EtgO_DCuWGCnWphhJxUspgZ7Cumr7WbQPvB_XdIek:1v0Xf3:JuwwJl9Z4rvcgvHZlIHi1M3wl9_VQdYzEY2ePT0Rm8U	2025-10-05 23:56:21.377279-04
id6vsz24c1c6x9l1cbgffdjkvdkvqfm1	.eJwVyksKgDAMANG7ZK1SY7toVx7CC8QStdCPRAVBvLt19xjmgeu4SEIB94AvIlxVERNnEj5oFtoom2VcE4XY-ZKgASnxv2LgfDK8DfC9B6HaUKFplW0RJ6Wc1k4PXT-gsQbeD_X9Ie8:1v0Xwp:z6AzxRXVH8T_2OjuLK15KpqL5HwK2Nj2f4n-nithjoU	2025-10-06 00:14:43.139967-04
316v9k0h0jieys7z9oatjtop20qehwd8	eyJleHBpcmEiOiIyMDI1LTA5LTIyVDE2OjQ3OjA4LjgyMDMyMiIsInVzdWFyaW8iOnsiY29ycmVvIjoibWF5cmVyb3NzQGdtYWlsLmNvbSIsInJvbCI6ImNsaWVudGUifX0:1v0myC:YfFVI2sCgmY9qMOyHa5sbbWLxnQYOTmEzYKAeDa6cTU	2025-10-06 16:17:08.821054-04
\.


--
-- TOC entry 5179 (class 0 OID 0)
-- Dependencies: 235
-- Name: carritos_id_carrito_seq; Type: SEQUENCE SET; Schema: datos_tienda; Owner: postgres
--

SELECT pg_catalog.setval('datos_tienda.carritos_id_carrito_seq', 1, false);


--
-- TOC entry 5180 (class 0 OID 0)
-- Dependencies: 233
-- Name: categorias_id_categoria_seq; Type: SEQUENCE SET; Schema: datos_tienda; Owner: postgres
--

SELECT pg_catalog.setval('datos_tienda.categorias_id_categoria_seq', 1, false);


--
-- TOC entry 5181 (class 0 OID 0)
-- Dependencies: 237
-- Name: items_carrito_id_item_seq; Type: SEQUENCE SET; Schema: datos_tienda; Owner: postgres
--

SELECT pg_catalog.setval('datos_tienda.items_carrito_id_item_seq', 1, false);


--
-- TOC entry 5182 (class 0 OID 0)
-- Dependencies: 241
-- Name: items_orden_id_item_orden_seq; Type: SEQUENCE SET; Schema: datos_tienda; Owner: postgres
--

SELECT pg_catalog.setval('datos_tienda.items_orden_id_item_orden_seq', 1, false);


--
-- TOC entry 5183 (class 0 OID 0)
-- Dependencies: 239
-- Name: ordenes_id_orden_seq; Type: SEQUENCE SET; Schema: datos_tienda; Owner: postgres
--

SELECT pg_catalog.setval('datos_tienda.ordenes_id_orden_seq', 1, false);


--
-- TOC entry 5184 (class 0 OID 0)
-- Dependencies: 231
-- Name: productos_id_producto_seq; Type: SEQUENCE SET; Schema: datos_tienda; Owner: postgres
--

SELECT pg_catalog.setval('datos_tienda.productos_id_producto_seq', 1, false);


--
-- TOC entry 5185 (class 0 OID 0)
-- Dependencies: 229
-- Name: direcciones_id_direccion_seq; Type: SEQUENCE SET; Schema: datos_usuario; Owner: postgres
--

SELECT pg_catalog.setval('datos_usuario.direcciones_id_direccion_seq', 1, false);


--
-- TOC entry 5186 (class 0 OID 0)
-- Dependencies: 223
-- Name: estados_id_estado_seq; Type: SEQUENCE SET; Schema: datos_usuario; Owner: postgres
--

SELECT pg_catalog.setval('datos_usuario.estados_id_estado_seq', 1, false);


--
-- TOC entry 5187 (class 0 OID 0)
-- Dependencies: 225
-- Name: municipios_id_municipio_seq; Type: SEQUENCE SET; Schema: datos_usuario; Owner: postgres
--

SELECT pg_catalog.setval('datos_usuario.municipios_id_municipio_seq', 1, false);


--
-- TOC entry 5188 (class 0 OID 0)
-- Dependencies: 227
-- Name: parroquias_id_parroquia_seq; Type: SEQUENCE SET; Schema: datos_usuario; Owner: postgres
--

SELECT pg_catalog.setval('datos_usuario.parroquias_id_parroquia_seq', 1, false);


--
-- TOC entry 5189 (class 0 OID 0)
-- Dependencies: 219
-- Name: roles_id_rol_seq; Type: SEQUENCE SET; Schema: datos_usuario; Owner: postgres
--

SELECT pg_catalog.setval('datos_usuario.roles_id_rol_seq', 2, true);


--
-- TOC entry 5190 (class 0 OID 0)
-- Dependencies: 221
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE SET; Schema: datos_usuario; Owner: postgres
--

SELECT pg_catalog.setval('datos_usuario.usuarios_id_usuario_seq', 23, true);


--
-- TOC entry 5191 (class 0 OID 0)
-- Dependencies: 249
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_group_id_seq', 1, false);


--
-- TOC entry 5192 (class 0 OID 0)
-- Dependencies: 251
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_group_permissions_id_seq', 1, false);


--
-- TOC entry 5193 (class 0 OID 0)
-- Dependencies: 247
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_permission_id_seq', 24, true);


--
-- TOC entry 5194 (class 0 OID 0)
-- Dependencies: 255
-- Name: auth_user_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_user_groups_id_seq', 1, false);


--
-- TOC entry 5195 (class 0 OID 0)
-- Dependencies: 253
-- Name: auth_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_user_id_seq', 1, false);


--
-- TOC entry 5196 (class 0 OID 0)
-- Dependencies: 257
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_user_user_permissions_id_seq', 1, false);


--
-- TOC entry 5197 (class 0 OID 0)
-- Dependencies: 259
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.django_admin_log_id_seq', 1, false);


--
-- TOC entry 5198 (class 0 OID 0)
-- Dependencies: 245
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.django_content_type_id_seq', 6, true);


--
-- TOC entry 5199 (class 0 OID 0)
-- Dependencies: 243
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.django_migrations_id_seq', 18, true);


--
-- TOC entry 4882 (class 2606 OID 16960)
-- Name: carritos id_carrito_pk; Type: CONSTRAINT; Schema: datos_tienda; Owner: postgres
--

ALTER TABLE ONLY datos_tienda.carritos
    ADD CONSTRAINT id_carrito_pk PRIMARY KEY (id_carrito);


--
-- TOC entry 4880 (class 2606 OID 16953)
-- Name: categorias id_categoria_pk; Type: CONSTRAINT; Schema: datos_tienda; Owner: postgres
--

ALTER TABLE ONLY datos_tienda.categorias
    ADD CONSTRAINT id_categoria_pk PRIMARY KEY (id_categoria);


--
-- TOC entry 4890 (class 2606 OID 16987)
-- Name: items_orden id_item_orden_pk; Type: CONSTRAINT; Schema: datos_tienda; Owner: postgres
--

ALTER TABLE ONLY datos_tienda.items_orden
    ADD CONSTRAINT id_item_orden_pk PRIMARY KEY (id_item_orden);


--
-- TOC entry 4886 (class 2606 OID 16969)
-- Name: items_carrito id_item_pk; Type: CONSTRAINT; Schema: datos_tienda; Owner: postgres
--

ALTER TABLE ONLY datos_tienda.items_carrito
    ADD CONSTRAINT id_item_pk PRIMARY KEY (id_item);


--
-- TOC entry 4888 (class 2606 OID 16978)
-- Name: ordenes id_orden_pk; Type: CONSTRAINT; Schema: datos_tienda; Owner: postgres
--

ALTER TABLE ONLY datos_tienda.ordenes
    ADD CONSTRAINT id_orden_pk PRIMARY KEY (id_orden);


--
-- TOC entry 4878 (class 2606 OID 16946)
-- Name: productos id_producto_pk; Type: CONSTRAINT; Schema: datos_tienda; Owner: postgres
--

ALTER TABLE ONLY datos_tienda.productos
    ADD CONSTRAINT id_producto_pk PRIMARY KEY (id_producto);


--
-- TOC entry 4884 (class 2606 OID 16962)
-- Name: carritos usuario_unico_en_carrito; Type: CONSTRAINT; Schema: datos_tienda; Owner: postgres
--

ALTER TABLE ONLY datos_tienda.carritos
    ADD CONSTRAINT usuario_unico_en_carrito UNIQUE (usuario_fk);


--
-- TOC entry 4866 (class 2606 OID 16906)
-- Name: usuarios correo_unique; Type: CONSTRAINT; Schema: datos_usuario; Owner: postgres
--

ALTER TABLE ONLY datos_usuario.usuarios
    ADD CONSTRAINT correo_unique UNIQUE (correo);


--
-- TOC entry 4876 (class 2606 OID 16936)
-- Name: direcciones id_direccion_pk; Type: CONSTRAINT; Schema: datos_usuario; Owner: postgres
--

ALTER TABLE ONLY datos_usuario.direcciones
    ADD CONSTRAINT id_direccion_pk PRIMARY KEY (id_direccion);


--
-- TOC entry 4870 (class 2606 OID 16913)
-- Name: estados id_estado_pk; Type: CONSTRAINT; Schema: datos_usuario; Owner: postgres
--

ALTER TABLE ONLY datos_usuario.estados
    ADD CONSTRAINT id_estado_pk PRIMARY KEY (id_estado);


--
-- TOC entry 4872 (class 2606 OID 16920)
-- Name: municipios id_municipio_pk; Type: CONSTRAINT; Schema: datos_usuario; Owner: postgres
--

ALTER TABLE ONLY datos_usuario.municipios
    ADD CONSTRAINT id_municipio_pk PRIMARY KEY (id_municipio);


--
-- TOC entry 4874 (class 2606 OID 16927)
-- Name: parroquias id_parroquia_pk; Type: CONSTRAINT; Schema: datos_usuario; Owner: postgres
--

ALTER TABLE ONLY datos_usuario.parroquias
    ADD CONSTRAINT id_parroquia_pk PRIMARY KEY (id_parroquia);


--
-- TOC entry 4864 (class 2606 OID 16895)
-- Name: roles id_rol_pk; Type: CONSTRAINT; Schema: datos_usuario; Owner: postgres
--

ALTER TABLE ONLY datos_usuario.roles
    ADD CONSTRAINT id_rol_pk PRIMARY KEY (id_rol);


--
-- TOC entry 4868 (class 2606 OID 16904)
-- Name: usuarios id_usuario_pk; Type: CONSTRAINT; Schema: datos_usuario; Owner: postgres
--

ALTER TABLE ONLY datos_usuario.usuarios
    ADD CONSTRAINT id_usuario_pk PRIMARY KEY (id_usuario);


--
-- TOC entry 4904 (class 2606 OID 17188)
-- Name: auth_group auth_group_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);


--
-- TOC entry 4909 (class 2606 OID 17119)
-- Name: auth_group_permissions auth_group_permissions_group_id_permission_id_0cd325b0_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_permission_id_0cd325b0_uniq UNIQUE (group_id, permission_id);


--
-- TOC entry 4912 (class 2606 OID 17088)
-- Name: auth_group_permissions auth_group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 4906 (class 2606 OID 17080)
-- Name: auth_group auth_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);


--
-- TOC entry 4899 (class 2606 OID 17110)
-- Name: auth_permission auth_permission_content_type_id_codename_01ab375a_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_codename_01ab375a_uniq UNIQUE (content_type_id, codename);


--
-- TOC entry 4901 (class 2606 OID 17074)
-- Name: auth_permission auth_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);


--
-- TOC entry 4920 (class 2606 OID 17102)
-- Name: auth_user_groups auth_user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_pkey PRIMARY KEY (id);


--
-- TOC entry 4923 (class 2606 OID 17134)
-- Name: auth_user_groups auth_user_groups_user_id_group_id_94350c0c_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_group_id_94350c0c_uniq UNIQUE (user_id, group_id);


--
-- TOC entry 4914 (class 2606 OID 17094)
-- Name: auth_user auth_user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_pkey PRIMARY KEY (id);


--
-- TOC entry 4926 (class 2606 OID 17108)
-- Name: auth_user_user_permissions auth_user_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 4929 (class 2606 OID 17148)
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_permission_id_14a6b632_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_permission_id_14a6b632_uniq UNIQUE (user_id, permission_id);


--
-- TOC entry 4917 (class 2606 OID 17183)
-- Name: auth_user auth_user_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_username_key UNIQUE (username);


--
-- TOC entry 4932 (class 2606 OID 17169)
-- Name: django_admin_log django_admin_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);


--
-- TOC entry 4894 (class 2606 OID 17068)
-- Name: django_content_type django_content_type_app_label_model_76bd3d3b_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_app_label_model_76bd3d3b_uniq UNIQUE (app_label, model);


--
-- TOC entry 4896 (class 2606 OID 17066)
-- Name: django_content_type django_content_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);


--
-- TOC entry 4892 (class 2606 OID 17060)
-- Name: django_migrations django_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4936 (class 2606 OID 17196)
-- Name: django_session django_session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);


--
-- TOC entry 4902 (class 1259 OID 17189)
-- Name: auth_group_name_a6ea08ec_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_group_name_a6ea08ec_like ON public.auth_group USING btree (name varchar_pattern_ops);


--
-- TOC entry 4907 (class 1259 OID 17130)
-- Name: auth_group_permissions_group_id_b120cbf9; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_group_permissions_group_id_b120cbf9 ON public.auth_group_permissions USING btree (group_id);


--
-- TOC entry 4910 (class 1259 OID 17131)
-- Name: auth_group_permissions_permission_id_84c5c92e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_group_permissions_permission_id_84c5c92e ON public.auth_group_permissions USING btree (permission_id);


--
-- TOC entry 4897 (class 1259 OID 17116)
-- Name: auth_permission_content_type_id_2f476e4b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_permission_content_type_id_2f476e4b ON public.auth_permission USING btree (content_type_id);


--
-- TOC entry 4918 (class 1259 OID 17146)
-- Name: auth_user_groups_group_id_97559544; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_groups_group_id_97559544 ON public.auth_user_groups USING btree (group_id);


--
-- TOC entry 4921 (class 1259 OID 17145)
-- Name: auth_user_groups_user_id_6a12ed8b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_groups_user_id_6a12ed8b ON public.auth_user_groups USING btree (user_id);


--
-- TOC entry 4924 (class 1259 OID 17160)
-- Name: auth_user_user_permissions_permission_id_1fbb5f2c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_user_permissions_permission_id_1fbb5f2c ON public.auth_user_user_permissions USING btree (permission_id);


--
-- TOC entry 4927 (class 1259 OID 17159)
-- Name: auth_user_user_permissions_user_id_a95ead1b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_user_permissions_user_id_a95ead1b ON public.auth_user_user_permissions USING btree (user_id);


--
-- TOC entry 4915 (class 1259 OID 17184)
-- Name: auth_user_username_6821ab7c_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_username_6821ab7c_like ON public.auth_user USING btree (username varchar_pattern_ops);


--
-- TOC entry 4930 (class 1259 OID 17180)
-- Name: django_admin_log_content_type_id_c4bce8eb; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_admin_log_content_type_id_c4bce8eb ON public.django_admin_log USING btree (content_type_id);


--
-- TOC entry 4933 (class 1259 OID 17181)
-- Name: django_admin_log_user_id_c564eba6; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_admin_log_user_id_c564eba6 ON public.django_admin_log USING btree (user_id);


--
-- TOC entry 4934 (class 1259 OID 17198)
-- Name: django_session_expire_date_a5c62663; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_session_expire_date_a5c62663 ON public.django_session USING btree (expire_date);


--
-- TOC entry 4937 (class 1259 OID 17197)
-- Name: django_session_session_key_c0390e0f_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_session_session_key_c0390e0f_like ON public.django_session USING btree (session_key varchar_pattern_ops);


--
-- TOC entry 4945 (class 2606 OID 17023)
-- Name: items_carrito carrito_fk; Type: FK CONSTRAINT; Schema: datos_tienda; Owner: postgres
--

ALTER TABLE ONLY datos_tienda.items_carrito
    ADD CONSTRAINT carrito_fk FOREIGN KEY (carrito_fk) REFERENCES datos_tienda.carritos(id_carrito) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 4943 (class 2606 OID 17013)
-- Name: productos categoria_fk; Type: FK CONSTRAINT; Schema: datos_tienda; Owner: postgres
--

ALTER TABLE ONLY datos_tienda.productos
    ADD CONSTRAINT categoria_fk FOREIGN KEY (categoria_fk) REFERENCES datos_tienda.categorias(id_categoria) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 4947 (class 2606 OID 17038)
-- Name: ordenes direccion_fk; Type: FK CONSTRAINT; Schema: datos_tienda; Owner: postgres
--

ALTER TABLE ONLY datos_tienda.ordenes
    ADD CONSTRAINT direccion_fk FOREIGN KEY (direccion_envio_fk) REFERENCES datos_usuario.direcciones(id_direccion) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 4949 (class 2606 OID 17043)
-- Name: items_orden orden_fk; Type: FK CONSTRAINT; Schema: datos_tienda; Owner: postgres
--

ALTER TABLE ONLY datos_tienda.items_orden
    ADD CONSTRAINT orden_fk FOREIGN KEY (orden_fk) REFERENCES datos_tienda.ordenes(id_orden) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 4946 (class 2606 OID 17028)
-- Name: items_carrito producto_fk; Type: FK CONSTRAINT; Schema: datos_tienda; Owner: postgres
--

ALTER TABLE ONLY datos_tienda.items_carrito
    ADD CONSTRAINT producto_fk FOREIGN KEY (producto_fk) REFERENCES datos_tienda.productos(id_producto) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 4950 (class 2606 OID 17048)
-- Name: items_orden producto_fk; Type: FK CONSTRAINT; Schema: datos_tienda; Owner: postgres
--

ALTER TABLE ONLY datos_tienda.items_orden
    ADD CONSTRAINT producto_fk FOREIGN KEY (producto_fk) REFERENCES datos_tienda.productos(id_producto) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 4944 (class 2606 OID 17018)
-- Name: carritos usuario_fk; Type: FK CONSTRAINT; Schema: datos_tienda; Owner: postgres
--

ALTER TABLE ONLY datos_tienda.carritos
    ADD CONSTRAINT usuario_fk FOREIGN KEY (usuario_fk) REFERENCES datos_usuario.usuarios(id_usuario) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 4948 (class 2606 OID 17033)
-- Name: ordenes usuario_fk; Type: FK CONSTRAINT; Schema: datos_tienda; Owner: postgres
--

ALTER TABLE ONLY datos_tienda.ordenes
    ADD CONSTRAINT usuario_fk FOREIGN KEY (usuario_fk) REFERENCES datos_usuario.usuarios(id_usuario) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 4939 (class 2606 OID 16993)
-- Name: municipios estado_fk; Type: FK CONSTRAINT; Schema: datos_usuario; Owner: postgres
--

ALTER TABLE ONLY datos_usuario.municipios
    ADD CONSTRAINT estado_fk FOREIGN KEY (estado_fk) REFERENCES datos_usuario.estados(id_estado) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 4940 (class 2606 OID 16998)
-- Name: parroquias municipio_fk; Type: FK CONSTRAINT; Schema: datos_usuario; Owner: postgres
--

ALTER TABLE ONLY datos_usuario.parroquias
    ADD CONSTRAINT municipio_fk FOREIGN KEY (municipio_fk) REFERENCES datos_usuario.municipios(id_municipio) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 4941 (class 2606 OID 17003)
-- Name: direcciones parroquia_fk; Type: FK CONSTRAINT; Schema: datos_usuario; Owner: postgres
--

ALTER TABLE ONLY datos_usuario.direcciones
    ADD CONSTRAINT parroquia_fk FOREIGN KEY (parroquia_fk) REFERENCES datos_usuario.parroquias(id_parroquia) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 4938 (class 2606 OID 16988)
-- Name: usuarios rol_fk; Type: FK CONSTRAINT; Schema: datos_usuario; Owner: postgres
--

ALTER TABLE ONLY datos_usuario.usuarios
    ADD CONSTRAINT rol_fk FOREIGN KEY (rol_fk) REFERENCES datos_usuario.roles(id_rol) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 4942 (class 2606 OID 17008)
-- Name: direcciones usuario_fk; Type: FK CONSTRAINT; Schema: datos_usuario; Owner: postgres
--

ALTER TABLE ONLY datos_usuario.direcciones
    ADD CONSTRAINT usuario_fk FOREIGN KEY (usuario_fk) REFERENCES datos_usuario.usuarios(id_usuario);


--
-- TOC entry 4952 (class 2606 OID 17125)
-- Name: auth_group_permissions auth_group_permissio_permission_id_84c5c92e_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissio_permission_id_84c5c92e_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4953 (class 2606 OID 17120)
-- Name: auth_group_permissions auth_group_permissions_group_id_b120cbf9_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4951 (class 2606 OID 17111)
-- Name: auth_permission auth_permission_content_type_id_2f476e4b_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4954 (class 2606 OID 17140)
-- Name: auth_user_groups auth_user_groups_group_id_97559544_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_group_id_97559544_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4955 (class 2606 OID 17135)
-- Name: auth_user_groups auth_user_groups_user_id_6a12ed8b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_6a12ed8b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4956 (class 2606 OID 17154)
-- Name: auth_user_user_permissions auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4957 (class 2606 OID 17149)
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4958 (class 2606 OID 17170)
-- Name: django_admin_log django_admin_log_content_type_id_c4bce8eb_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_content_type_id_c4bce8eb_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4959 (class 2606 OID 17175)
-- Name: django_admin_log django_admin_log_user_id_c564eba6_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_user_id_c564eba6_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


-- Completed on 2025-09-22 16:51:50

--
-- PostgreSQL database dump complete
--

\unrestrict BsFvEXVepLMDaXeanWNAM0R79GYZwObeAxO63lrkGgMyzD8aUh5sfVlaleE4FFb

