-- Crear la tabla Areas con campos adicionales
CREATE TABLE public.areas (
    area_id SERIAL PRIMARY KEY,
    nombre_area VARCHAR(255) NOT NULL,
    creacion TIMESTAMP NOT NULL,
    fecha_actualizacion TIMESTAMP NOT NULL,
    usuario VARCHAR(20) NOT NULL
);

-- Insertar datos en la tabla Areas con valores específicos
INSERT INTO public.areas (nombre_area, creacion, fecha_actualizacion, usuario) VALUES
('Retail', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Automotriz', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Telecomunicaciones', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Bancos y Servicios Financieros', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Alimentos y Bebidas', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Agencias de Publicidad', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Agencias de Medios', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Tecnología', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Software y Servicios Digitales', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Salud', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Energía', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin');

-- Crear la tabla Clientes con campos adicionales e integridad referencial
CREATE TABLE public.clientes (
    cliente_id SERIAL PRIMARY KEY,
    nombre_cliente VARCHAR(255) NOT NULL,
    area_id INT,
    email_contacto VARCHAR(100),
    fono_contacto VARCHAR(30),
    creacion TIMESTAMP NOT NULL,
    fecha_actualizacion TIMESTAMP NOT NULL,
    usuario VARCHAR(20) NOT NULL,
    FOREIGN KEY (area_id) REFERENCES Areas(area_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Eliminar el constraint y cambiar la logica a no elimimnar en cascada
ALTER TABLE public.clientes DROP CONSTRAINT clientes_area_id_fkey;

--Agregar la nueva logica que impide borrra en cascada indicando la integridad referencial con area
ALTER TABLE public.clientes
ADD CONSTRAINT clientes_area_id_fkey
FOREIGN KEY (area_id) REFERENCES public.areas (area_id)
ON DELETE RESTRICT
ON UPDATE CASCADE;
-- Insertar datos en la tabla Clientes con valores específicos
INSERT INTO public.clientes (nombre_cliente, area_id, email_contacto, fono_contacto, creacion, fecha_actualizacion, usuario) VALUES
('Falabella', 12, 'contacto@falabella.cl', '+56912345678', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Ripley', 12, 'contacto@ripley.cl', '+56912345679', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Paris', 12, 'contacto@paris.cl', '+56912345680', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Chevrolet', 13, 'contacto@chevrolet.cl', '+56912345681', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Hyundai', 13, 'contacto@hyundai.cl', '+56912345682', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Toyota', 13, 'contacto@toyota.cl', '+56912345683', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Entel', 13, 'contacto@entel.cl', '+56912345684', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Movistar', 14, 'contacto@movistar.cl', '+56912345685', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Claro', 14, 'contacto@claro.cl', '+56912345686', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Banco de Chile', 15, 'contacto@bancochile.cl', '+56912345687', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Banco Santander', 15, 'contacto@santander.cl', '+56912345688', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('BCI', 15, 'contacto@bci.cl', '+56912345689', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Coca-Cola', 16, 'contacto@cocacola.cl', '+56912345690', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Nestlé', 16, 'contacto@nestle.cl', '+56912345691', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('CCU', 16, 'contacto@ccu.cl', '+56912345692', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('BBDO', 17, 'contacto@bbdo.cl', '+56912345693', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('McCann', 17, 'contacto@mccann.cl', '+56912345694', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Ogilvy', 17, 'contacto@ogilvy.cl', '+56912345695', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Mindshare', 18, 'contacto@mindshare.cl', '+56912345696', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('GroupM', 18, 'contacto@groupm.cl', '+56912345697', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Initiative', 18, 'contacto@initiative.cl', '+56912345698', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Samsung', 19, 'contacto@samsung.cl', '+56912345699', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Sony', 19, 'contacto@sony.cl', '+56912345700', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('LG', 19, 'contacto@lg.cl', '+56912345701', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Microsoft', 20, 'contacto@microsoft.cl', '+56912345702', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Oracle', 20, 'contacto@oracle.cl', '+56912345703', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('IBM', 20, 'contacto@ibm.cl', '+56912345704', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Clínica Alemana', 21, 'contacto@alemana.cl', '+56912345705', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Red Salud', 21, 'contacto@redsalud.cl', '+56912345706', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Bupa', 21, 'contacto@bupa.cl', '+56912345707', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Enel', 22, 'contacto@enel.cl', '+56912345708', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Copec', 22, 'contacto@copec.cl', '+56912345709', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin'),
('Arauco', 22, 'contacto@arauco.cl', '+56912345710', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'megamediaAdmin');

-- Crear la tabla menu , permnite disponibilizar los menus que pueden existir y su ruta de acceso
-- Campos:
-- * nombre_menu           : es el nombfe del menu que aparecerá en la pagina de inicio
-- * pagina_inicio         : es el path que llama a la pagina particular del mantenedor
-- * grupos_permisos_carga : indica que grupos tienen acceso a estos menús
CREATE TABLE public.menu (
	id_menu int4 GENERATED BY DEFAULT AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE) NOT NULL,
	nombre_menu varchar(30) NULL,
	pagina_menu varchar(200) NOT NULL,
	grupos_permisos_carga varchar(600) NOT NULL,
	CONSTRAINT menu_pk PRIMARY KEY (id_menu)
);

-- Insertar datos en la tabla Menu, para el caso de prueba solo dos menus disponibles
-- Administrar Áreas, permite cargar la ruta donde se muestra el mantenedor de Areas de negocio de Megamedia
-- Administrar clientes, permite cargar la ruta donde se muestra el mantenedor de clientes
INSERT INTO public.menu (nombre_menu, pagina_menu,grupos_permisos_carga )
VALUES
    ('Administrar Áreas', '/mant_areas/','superuser:contacto'),
    ('Administrar Clientes', '/mant_clientes/', 'superuser:contacto');


-- DECLARACION DE PROCEDIMIENTOS Y FUNCIONES Y TIPOS DE DB

-- Define un tipo de dato compuesto para los resultados paginados
CREATE TYPE tipo_resultado_paginado AS (
    numero_pagina INT,
    total_paginas INT,
    data JSONB
);

-- Funcion get_areas_paginadas:  que entrega la consulta de areas de forma paginada
-- Parámetros de entrada:
-- * p_numero_pagina        : pagina deseada
-- * p_registros_por_pagina : total de registrios por pagina
-- * p_busqueda             : permite buscar coincidencias de nombres
-- * p_tipo_busqueda       : tipo de buisqueda, si es MODIFICADO, significa que busca el regiustro en particular
CREATE OR REPLACE FUNCTION get_areas_paginadas(
    p_numero_pagina INT,
    p_registros_por_pagina INT,
    p_busqueda VARCHAR,
    p_tipo_busqueda TEXT
)
RETURNS tipo_resultado_paginado AS $$
DECLARE
    v_total_registros INT;
    v_paginas_totales INT;
    v_offset INT;
BEGIN
    -- Calcula el offset para la página solicitada
    v_offset := (p_numero_pagina - 1) * p_registros_por_pagina;

    -- Contar el número total de registros basado en el tipo de búsqueda
    IF p_tipo_busqueda = 'NORMAL' THEN
        -- Búsqueda normal basada en nombre_area
        IF p_busqueda IS NULL OR p_busqueda = '' THEN
            SELECT COUNT(*) INTO v_total_registros FROM areas;
        ELSE
            SELECT COUNT(*) INTO v_total_registros
            FROM areas
            WHERE nombre_area ILIKE '%' || p_busqueda || '%';
        END IF;
    ELSE
        -- Búsqueda por area_id cuando p_tipo_busqueda no es 'NORMAL'
        IF p_busqueda IS NULL OR p_busqueda = '' THEN
            SELECT COUNT(*) INTO v_total_registros FROM areas;
        ELSE
            SELECT COUNT(*) INTO v_total_registros
            FROM areas
            WHERE area_id = CAST(p_busqueda AS INT);
        END IF;
    END IF;

    -- Calcular el número total de páginas
    v_paginas_totales := CEIL(v_total_registros::NUMERIC / p_registros_por_pagina);

    -- Devuelve el resultado paginado, considerando el parámetro de búsqueda y tipo de búsqueda
    RETURN (
        SELECT ROW(p_numero_pagina, v_paginas_totales,
            (
                SELECT jsonb_agg(jsonb_build_object(
                    'id', area_id,
                    'nombre', nombre_area,
                    'creacion', TO_CHAR(creacion, 'DD/MM/YYYY HH24:MI'),
                    'fecha_actualizacion', TO_CHAR(fecha_actualizacion, 'DD/MM/YYYY HH24:MI'),
                    'usuario', usuario
                ))
                FROM (
                    SELECT area_id, nombre_area, creacion, fecha_actualizacion, usuario
                    FROM areas
                    WHERE (
                        (p_tipo_busqueda = 'NORMAL' AND (p_busqueda IS NULL OR p_busqueda = '' OR nombre_area ILIKE '%' || p_busqueda || '%'))
                        OR
                        (p_tipo_busqueda <> 'NORMAL' AND area_id = CAST(p_busqueda AS INT))
                    )
                    ORDER BY area_id
                    OFFSET v_offset
                    LIMIT p_registros_por_pagina
                ) subquery
            )
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Funcion get_clientes_paginados:  que entrega la consulta de clientes de forma paginada
-- Parámetros de entrada:
-- * p_numero_pagina        : pagina deseada
-- * p_registros_por_pagina : total de registrios por pagina
-- * p_busqueda             : permite buscar coincidencias de nombres
-- * p_tipo_busqueda       : tipo de buisqueda, si es MODIFICADO, significa que busca el regiustro en particular
CREATE OR REPLACE FUNCTION get_clientes_paginados(
    p_pagina_numero INTEGER,
    p_items_por_pagina INTEGER,
    p_busqueda TEXT,
    p_tipo_busqueda TEXT
)
RETURNS tipo_resultado_paginado AS
$$
DECLARE
    v_total_items INTEGER;
    v_total_paginas INTEGER;
    v_data JSONB;
BEGIN
    -- Contar el total de items que cumplen con el criterio de búsqueda
    IF p_tipo_busqueda = 'NORMAL' THEN
        -- Búsqueda normal basada en texto
        SELECT COUNT(*) INTO v_total_items
        FROM clientes c
        JOIN areas a ON c.area_id = a.area_id
        WHERE (c.nombre_cliente ILIKE '%' || p_busqueda || '%'
               OR c.email_contacto ILIKE '%' || p_busqueda || '%'
               OR c.fono_contacto ILIKE '%' || p_busqueda || '%'
               OR a.nombre_area ILIKE '%' || p_busqueda || '%');
    ELSE
        -- Búsqueda por cliente_id cuando p_tipo_busqueda no es 'NORMAL'
        SELECT COUNT(*) INTO v_total_items
        FROM clientes c
        JOIN areas a ON c.area_id = a.area_id
        WHERE c.cliente_id = CAST(p_busqueda AS INTEGER);
    END IF;

    -- Calcular el número total de páginas
    v_total_paginas := CEIL(v_total_items::NUMERIC / p_items_por_pagina);

    -- Obtener los datos paginados en formato JSONB
    IF p_tipo_busqueda = 'NORMAL' THEN
        -- Búsqueda normal basada en texto
        SELECT JSONB_AGG(cliente_json) INTO v_data
        FROM (
            SELECT jsonb_build_object(
                'cliente_id', c.cliente_id,
                'nombre_cliente', c.nombre_cliente,
                'area_id', c.area_id,
                'nombre_area', a.nombre_area,
                'email_contacto', c.email_contacto,
                'fono_contacto', c.fono_contacto,
                'creacion', TO_CHAR(c.creacion, 'DD/MM/YYYY HH24:MI'),
                'fecha_actualizacion', TO_CHAR(c.fecha_actualizacion, 'DD/MM/YYYY HH24:MI'),
                'usuario', c.usuario
            ) AS cliente_json
            FROM clientes c
            JOIN areas a ON c.area_id = a.area_id
            WHERE (c.nombre_cliente ILIKE '%' || p_busqueda || '%'
                   OR c.email_contacto ILIKE '%' || p_busqueda || '%'
                   OR c.fono_contacto ILIKE '%' || p_busqueda || '%'
                   OR a.nombre_area ILIKE '%' || p_busqueda || '%')
            ORDER BY c.creacion DESC
            LIMIT p_items_por_pagina
            OFFSET (p_pagina_numero - 1) * p_items_por_pagina
        ) AS subquery;
    ELSE
        -- Búsqueda por cliente_id cuando p_tipo_busqueda no es 'NORMAL'
        SELECT JSONB_AGG(cliente_json) INTO v_data
        FROM (
            SELECT jsonb_build_object(
                'cliente_id', c.cliente_id,
                'nombre_cliente', c.nombre_cliente,
                'area_id', c.area_id,
                'nombre_area', a.nombre_area,
                'email_contacto', c.email_contacto,
                'fono_contacto', c.fono_contacto,
                'creacion', TO_CHAR(c.creacion, 'DD/MM/YYYY HH24:MI'),
                'fecha_actualizacion', TO_CHAR(c.fecha_actualizacion, 'DD/MM/YYYY HH24:MI'),
                'usuario', c.usuario
            ) AS cliente_json
            FROM clientes c
            JOIN areas a ON c.area_id = a.area_id
            WHERE c.cliente_id = CAST(p_busqueda AS INTEGER)
            ORDER BY c.creacion DESC
            LIMIT p_items_por_pagina
            OFFSET (p_pagina_numero - 1) * p_items_por_pagina
        ) AS subquery;
    END IF;

    -- Devolver el resultado
    RETURN (p_pagina_numero, v_total_paginas, v_data)::tipo_resultado_paginado;
END;
$$
LANGUAGE plpgsql;

-- Creacion de indice para las búsquedas sobre el campo de texto nombre_area
-- tabla Areas
CREATE INDEX idx_nombre_area ON areas (nombre_area);

-- Creacion de indice para las búsquedas sobre el campo de texto nombre_cliente
-- tabla Clientes
CREATE INDEX idx_nombre_cliente ON clientes (nombre_cliente);

-- Borrar un area de Negocio basado en su area_id
-- Tabla Areas
CREATE OR REPLACE PROCEDURE delete_area(p_area_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM areas WHERE area_id = p_area_id;
END;
$$;

-- Borrar cliente basado en su client_id
-- Tabla clientes
CREATE OR REPLACE PROCEDURE delete_cliente(p_cliente_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM clientes WHERE cliente_id = p_cliente_id;
END;
$$;

-- Crear un  Area de Negocio
-- Tabla Areas
CREATE OR REPLACE PROCEDURE create_area(nombre_area VARCHAR, usuario VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO areas (nombre_area, creacion, fecha_actualizacion, usuario)
    VALUES (nombre_area, NOW(), NOW(), usuario);
END;
$$;

-- Crear un  Cliente para un Area de Negocio
-- Tabla Areas
CREATE OR REPLACE PROCEDURE create_cliente(area_id INT , nombre_cliente  VARCHAR, fono_contacto VARCHAR, email_contacto VARCHAR, usuario VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO clientes (area_id , nombre_cliente, fono_contacto, email_contacto, usuario, creacion, fecha_actualizacion)
    VALUES (area_id, nombre_cliente, fono_contacto, email_contacto, usuario, NOW(), NOW());
END;
$$;


-- Actualizar  un  Cliente para un Area de Negocio
-- Tabla Areas
CREATE OR REPLACE PROCEDURE update_cliente(p_cliente_id INT, p_area_id INT , p_nombre_cliente  VARCHAR, p_fono_contacto VARCHAR, p_email_contacto VARCHAR, p_usuario VARCHAR)
LANGUAGE plpgsql
AS $$
begin
	UPDATE clientes
    SET  area_id = p_area_id , nombre_cliente = p_nombre_cliente ,
         fono_contacto = p_fono_contacto , email_contacto = p_email_contacto ,
         usuario = p_usuario , fecha_actualizacion = NOW()
    WHERE  cliente_id = p_cliente_id ;
END;
$$;

-- Actualizar el nombre de un Area de Negocio
-- Tabla Areas
CREATE OR REPLACE PROCEDURE update_area(p_area_id INT, p_nombre_area VARCHAR, p_usuario VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE areas
    SET nombre_area = p_nombre_area, fecha_actualizacion = NOW(), usuario = p_usuario
    WHERE area_id = p_area_id;
END;
$$;


-- obtener las areas para una lista desplegable
-- tabla Areas
CREATE OR REPLACE FUNCTION get_areas()
RETURNS TABLE (id INT, nombre VARCHAR , creacion TEXT, fecha_actualizacion TEXT , usuario VARCHAR ) AS $$
BEGIN
    RETURN QUERY
    SELECT a.area_id as id, a.nombre_area as nombre ,
           TO_CHAR(a.creacion, 'DD/MM/YYYY HH24:MI') as creacion  ,
           TO_CHAR(a.fecha_actualizacion, 'DD/MM/YYYY HH24:MI') as fecha_actualizacion ,
           a.usuario
    FROM areas a;
END;
$$ LANGUAGE plpgsql;