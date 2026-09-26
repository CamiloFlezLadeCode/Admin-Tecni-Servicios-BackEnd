const { pool } = require('../config/db');

/**
 * ── PAGINADO DEL LADO DEL SERVIDOR ──────────────────────────────────────────
 *
 * Cada endpoint de listado atiende dos modos:
 *
 *   · Sin `pagina` en la query → responde el ARRAY COMPLETO, igual que siempre.
 *     Así no se rompe a nadie más que consuma el endpoint (el panel, selects,
 *     informes, etc.).
 *   · Con `pagina` → responde { Datos, Total, Pagina, Limite, TotalPaginas }
 *     y, si el endpoint lo necesita, datos extra calculados sobre TODO el
 *     conjunto (resúmenes, opciones de filtros…).
 *
 * La consulta original NO se reescribe: se le añade la búsqueda/filtros como
 * `HAVING` (o `WHERE` sobre una subconsulta) y `LIMIT … OFFSET …` al final.
 * Las filas que salen tienen exactamente las mismas columnas y valores de antes.
 *
 * Parámetros aceptados en la query string:
 *   pagina   → 1, 2, 3…            (por defecto 1)
 *   limite   → filas por página    (por defecto 10, máximo LIMITE_MAXIMO)
 *   busqueda → texto libre; se busca con LIKE en las columnas que muestra la
 *              tabla (definidas en cada consulta, nunca desde el cliente)
 */

const LIMITE_POR_DEFECTO = 10;
const LIMITE_MAXIMO = 100;
const LARGO_MAXIMO_BUSQUEDA = 100;

/**
 * Lee la paginación de `req.query`. Devuelve `null` si la petición no la pide
 * (modo clásico: array completo).
 */
function leerPaginacion(queryString = {}) {
    if (queryString.pagina === undefined || queryString.pagina === null || queryString.pagina === '') {
        return null;
    }
    const pagina = Math.max(1, Number.parseInt(queryString.pagina, 10) || 1);
    const limiteSolicitado = Number.parseInt(queryString.limite, 10) || LIMITE_POR_DEFECTO;
    const limite = Math.min(LIMITE_MAXIMO, Math.max(1, limiteSolicitado));
    const busqueda = String(queryString.busqueda ?? '').trim().slice(0, LARGO_MAXIMO_BUSQUEDA);
    return { pagina, limite, busqueda };
}

/** Los nombres de columna van entre backticks: sólo se aceptan identificadores simples. */
function identificador(nombre) {
    if (!/^[A-Za-z0-9_]+$/.test(nombre)) {
        throw new Error(`Identificador de columna no válido para paginado: ${nombre}`);
    }
    return `\`${nombre}\``;
}

/** Escapa los comodines de LIKE para que el texto se busque literalmente. */
function patronLike(texto) {
    return `%${texto.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
}

/**
 * Término sobre el que se busca. Normalmente el alias de una columna de salida.
 *
 * Excepción: en consultas con GROUP BY, si el alias coincide con una columna del
 * GROUP BY, MySQL resuelve el nombre en HAVING a la columna CRUDA y no al alias
 * (p. ej. `FechaCreacion` sería la fecha sin formato y no "lunes 03/03/2026…").
 * Para esos casos se pasa `{ expresion: '<misma expresión del SELECT>' }`.
 * Las expresiones las define el código, nunca llegan desde la petición.
 */
function terminoBusqueda(columna) {
    return typeof columna === 'string' ? identificador(columna) : columna.expresion;
}

/**
 * Condición de búsqueda: el texto aparece en cualquiera de las columnas.
 * Devuelve `null` si no hay texto o columnas donde buscar.
 */
function condicionBusqueda(columnas, busqueda) {
    if (!busqueda || !columnas || columnas.length === 0) return null;
    const patron = patronLike(busqueda);
    return {
        sql: `(${columnas.map((c) => `${terminoBusqueda(c)} LIKE ?`).join(' OR ')})`,
        params: columnas.map(() => patron),
    };
}

/** Condición de igualdad sobre una columna de salida; `null` si no hay valor. */
function condicionIgual(columna, valor) {
    if (valor === undefined || valor === null || valor === '') return null;
    return { sql: `${identificador(columna)} = ?`, params: [valor] };
}

/** Une condiciones `{ sql, params }` con AND, ignorando las nulas. */
function unirCondiciones(condiciones) {
    const validas = condiciones.filter(Boolean);
    return {
        sql: validas.map((c) => c.sql).join(' AND '),
        params: validas.flatMap((c) => c.params),
    };
}

/**
 * Aplica condiciones a la consulta base según el modo.
 * Siempre en línea nueva: la consulta original puede terminar en un comentario
 * `-- …`, y cualquier cosa añadida en esa misma línea quedaría comentada.
 */
function aplicarCondiciones(base, condicion, modo) {
    if (modo === 'subconsulta') {
        return `SELECT * FROM (\n${base}\n) AS base_paginada${condicion.sql ? `\nWHERE ${condicion.sql}` : ''}`;
    }
    if (!condicion.sql) return base;
    const conector = modo === 'having-existente' ? 'AND' : 'HAVING';
    return `${base}\n${conector} ${condicion.sql}`;
}

/**
 * Ejecuta la consulta paginada.
 *
 * @param {object}   opciones
 * @param {string}   opciones.sqlBase      SELECT original SIN `ORDER BY` ni `LIMIT`.
 * @param {any[]}    [opciones.params]     Parámetros de `sqlBase`.
 * @param {string}   opciones.orden        `ORDER BY` a aplicar (sin la palabra clave). Debe
 *                                         terminar en una columna única para que las páginas
 *                                         no se solapen cuando hay empates.
 * @param {Array<string|{expresion: string}>} [opciones.columnasBusqueda]  Alias de las columnas
 *                                         donde se busca (o expresiones, ver `terminoBusqueda`).
 * @param {object}   opciones.paginacion   Resultado de `leerPaginacion`.
 * @param {Array<{sql: string, params: any[]}|null>} [opciones.filtros]  Filtros extra
 *                                         (sobre alias de columnas de salida).
 * @param {'having'|'having-existente'|'subconsulta'} [opciones.modo]
 *     'having'           → añade `HAVING …` a la consulta original. Para cuando el
 *                          `ORDER BY` usa columnas de tablas que no salen en el SELECT.
 *     'having-existente' → la consulta ya termina en su propio HAVING: se añade `AND …`.
 *     'subconsulta'      → `SELECT * FROM (sqlBase) AS t WHERE …`. Para consultas con UNION;
 *                          el `orden` debe usar columnas de salida.
 * @param {boolean}  [opciones.fechasEnEspanol]  `SET lc_time_names = 'es_ES'` en la MISMA
 *                                         conexión, para DATE_FORMAT con días/meses en español.
 * @param {(conexion, conjuntos) => Promise<object>} [opciones.extras]
 *     Cálculos adicionales sobre conjuntos completos (sin paginar). `conjuntos` trae
 *     `{ base, filtrado, filtradoSinBusqueda }`, cada uno `{ sql, params }` listo para
 *     usarse como subconsulta.
 */
async function consultaPaginada({
    sqlBase,
    params = [],
    orden,
    columnasBusqueda = [],
    paginacion,
    filtros = [],
    modo = 'having',
    fechasEnEspanol = true,
    extras,
}) {
    const { pagina, limite, busqueda } = paginacion;
    const base = sqlBase.trim().replace(/;+\s*$/, '');

    const condicion = unirCondiciones([condicionBusqueda(columnasBusqueda, busqueda), ...filtros]);
    const filtrado = {
        sql: aplicarCondiciones(base, condicion, modo),
        params: [...params, ...condicion.params],
    };
    const offset = (pagina - 1) * limite;

    const conexion = await pool.getConnection();
    try {
        if (fechasEnEspanol) {
            await conexion.query(`SET lc_time_names = 'es_ES'`);
        }

        const [datos] = await conexion.query(`${filtrado.sql}\nORDER BY ${orden}\nLIMIT ? OFFSET ?`, [
            ...filtrado.params,
            limite,
            offset,
        ]);
        const [[conteo]] = await conexion.query(
            `SELECT COUNT(*) AS Total FROM (\n${filtrado.sql}\n) AS conteo_paginado`,
            filtrado.params
        );

        let extrasCalculados = {};
        if (extras) {
            const soloFiltros = unirCondiciones(filtros);
            extrasCalculados = await extras(conexion, {
                base: { sql: base, params: [...params] },
                filtrado,
                filtradoSinBusqueda: {
                    sql: aplicarCondiciones(base, soloFiltros, modo),
                    params: [...params, ...soloFiltros.params],
                },
            });
        }

        const total = Number(conteo.Total) || 0;
        return {
            Datos: datos,
            Total: total,
            Pagina: pagina,
            Limite: limite,
            TotalPaginas: Math.max(1, Math.ceil(total / limite)),
            ...extrasCalculados,
        };
    } finally {
        conexion.release();
    }
}

/** Aplica una transformación a las filas de una respuesta paginada (p. ej. el mapeo de un servicio). */
function mapearDatos(respuesta, transformar) {
    return { ...respuesta, Datos: respuesta.Datos.map(transformar) };
}

module.exports = {
    leerPaginacion,
    consultaPaginada,
    condicionIgual,
    mapearDatos,
    LIMITE_MAXIMO,
};
