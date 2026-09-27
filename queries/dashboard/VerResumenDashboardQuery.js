const { query } = require('../../config/db');

/**
 * Agregados del panel principal. Cada consulta replica los JOIN/filtros del
 * listado del que antes el front contaba filas (ListarClientes, ConsultarProyectos,
 * ConsultarRemisiones, VerTodasLasDevoluciones, VerStock*), para que los números
 * no cambien, pero devuelve sólo el conteo en vez del historial completo.
 */

// Mismo criterio que ConsultarListarClientesQuery: usuarios con rol 'Cliente'.
const ContarClientesQuery = async () => {
    const [fila] = await query(`
        SELECT COUNT(*) AS Total
        FROM usuario AS usu
        INNER JOIN usuario_roles AS usurol ON usu.DocumentoUsuario = usurol.DocumentoUsuario
        INNER JOIN roles AS rol ON usurol.IdRol = rol.IdRol
        WHERE rol.Rol = 'Cliente'
    `);
    return Number(fila?.Total) || 0;
};

// Mismos INNER JOIN que ConsultarProyectoQuery; "activo" se comparaba sin distinguir mayúsculas.
const ContarProyectosQuery = async () => {
    const [fila] = await query(`
        SELECT
            COUNT(*) AS Total,
            COALESCE(SUM(LOWER(TRIM(esta.Estado)) = 'activo'), 0) AS Activos
        FROM proyectos AS proye
        INNER JOIN usuario AS usu ON proye.DocumentoCliente = usu.DocumentoUsuario
        INNER JOIN usuario AS usu2 ON proye.UsuarioCreacion = usu2.DocumentoUsuario
        INNER JOIN estado AS esta ON proye.IdEstado = esta.IdEstado
    `);
    return { Total: Number(fila?.Total) || 0, Activos: Number(fila?.Activos) || 0 };
};

// Equipos + repuestos por CantidadDisponible: Agotado <= 0, Bajo 1..5, OK > 5
// (mismos umbrales que usaba el front).
const ResumenInventarioQuery = async () => {
    const [fila] = await query(`
        SELECT
            COALESCE(SUM(inv.Cantidad > 5), 0) AS OK,
            COALESCE(SUM(inv.Cantidad > 0 AND inv.Cantidad <= 5), 0) AS Bajo,
            COALESCE(SUM(inv.Cantidad <= 0 OR inv.Cantidad IS NULL), 0) AS Agotado
        FROM (
            SELECT e.CantidadDisponible AS Cantidad FROM equipo AS e
            UNION ALL
            SELECT rep.CantidadDisponible AS Cantidad FROM repuestos AS rep
        ) AS inv
    `);
    return { OK: Number(fila?.OK) || 0, Bajo: Number(fila?.Bajo) || 0, Agotado: Number(fila?.Agotado) || 0 };
};

// Clientes con más remisiones + devoluciones. Se agrupa por documento y se muestra
// el nombre completo: el nombre corto de los listados (primer nombre + primer
// apellido) se repite entre clientes distintos (p. ej. "EQUIPOS DAR" y "EQUIPOS Y
// SERVICIOS CIVILES" salían ambos como "EQUIPOS" y el front los sumaba juntos).
// Se conservan los INNER JOIN de los listados para contar las mismas filas.
const TopClientesQuery = async (Limite) => {
    return query(`
        SELECT
            mov.DocumentoCliente,
            TRIM(CONCAT(COALESCE(cliente.Nombres, ''), ' ', COALESCE(cliente.Apellidos, ''))) AS Cliente,
            SUM(mov.Tipo = 'R') AS CantidadRemisiones,
            SUM(mov.Tipo = 'D') AS CantidadDevoluciones,
            COUNT(*) AS Total
        FROM (
            SELECT 'R' AS Tipo, remi.DocumentoCliente
            FROM remisiones AS remi
            INNER JOIN proyectos AS proyec ON remi.IdProyecto = proyec.IdProyecto
            INNER JOIN usuario AS usucreacion ON remi.UsuarioCreacion = usucreacion.DocumentoUsuario
            INNER JOIN estado AS esta ON remi.IdEstado = esta.IdEstado
            UNION ALL
            SELECT 'D' AS Tipo, devo.DocumentoCliente
            FROM devoluciones AS devo
            INNER JOIN proyectos AS proyec ON devo.IdProyecto = proyec.IdProyecto
            INNER JOIN usuario AS usucreacion ON devo.UsuarioCreacion = usucreacion.DocumentoUsuario
            INNER JOIN estado AS esta ON devo.IdEstado = esta.IdEstado
        ) AS mov
        INNER JOIN usuario AS cliente ON mov.DocumentoCliente = cliente.DocumentoUsuario
        GROUP BY mov.DocumentoCliente, cliente.Nombres, cliente.Apellidos
        ORDER BY Total DESC, Cliente ASC, mov.DocumentoCliente ASC
        LIMIT ?
    `, [Limite]);
};

module.exports = {
    ContarClientesQuery,
    ContarProyectosQuery,
    ResumenInventarioQuery,
    TopClientesQuery
};
