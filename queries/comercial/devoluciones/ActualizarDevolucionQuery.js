const { pool } = require("../../../config/db");

const ActualizarDevolucionQuery = {
  async getDevolucionById(connection, IdDevolucion) {
    const conn = connection || pool;
    const [rows] = await conn.query(
      `SELECT 
                IdDevolucion,
                NoDevolucion,
                DocumentoCliente,
                IdProyecto,
                Observaciones,
                PersonaQueRecibe,
                PersonaQueEntrega,
                IncluyeTransporte,
                ValorTransporte,
                FechaDevolucion,
                IdEstado
            FROM devoluciones
            WHERE IdDevolucion = ?`,
      [IdDevolucion],
    );
    return rows[0] || null;
  },

  async getDetallesDevolucion(connection, IdDevolucion) {
    const conn = connection || pool;
    const [rows] = await conn.query(
      `SELECT 
                dd.IdDetalleDevolucion,
                dd.IdDevolucion,
                dd.IdRemision,
                dd.IdDetalleRemision,
                dd.IdEquipo,
                dd.Cantidad,
                dd.IdEstado,
                dr.DocumentoSubarrendatario
            FROM detalles_devoluciones dd
            LEFT JOIN detalles_remisiones dr ON dd.IdDetalleRemision = dr.IdDetalleRemision
            WHERE dd.IdDevolucion = ?`,
      [IdDevolucion],
    );
    return rows;
  },

  async updateCabeceraDevolucion(connection, params) {
    const conn = connection || pool;
    const sql = `
            UPDATE devoluciones
            SET 
                Observaciones = ?,
                PersonaQueRecibe = ?,
                PersonaQueEntrega = ?,
                IncluyeTransporte = ?,
                ValorTransporte = ?,
                FechaDevolucion = ?,
                IdEstado = ?
            WHERE IdDevolucion = ?
        `;
    return conn.query(sql, params);
  },

  async updateDetalleDevolucion(connection, params) {
    const conn = connection || pool;
    const sql = `
            UPDATE detalles_devoluciones
            SET 
                Cantidad = ?,
                IdEstado = ?
            WHERE IdDetalleDevolucion = ?
        `;
    return conn.query(sql, params);
  },

  async insertDetalleDevolucion(connection, params) {
    const conn = connection || pool;
    const sql = `
            INSERT INTO detalles_devoluciones (
                IdDevolucion,
                IdEquipo,
                Cantidad,
                IdEstado,
                IdRemision,
                IdDetalleRemision
            ) VALUES (?, ?, ?, ?, ?, ?)
        `;
    const [result] = await conn.query(sql, params);
    return result;
  },

  async deleteDetalleDevolucion(connection, IdDetalleDevolucion) {
    const conn = connection || pool;
    const sql = `
            DELETE FROM detalles_devoluciones
            WHERE IdDetalleDevolucion = ?
        `;
    return conn.query(sql, [IdDetalleDevolucion]);
  },

  async getEquipoInfo(connection, IdEquipo) {
    const conn = connection || pool;
    const [rows] = await conn.query(
      `
            SELECT 
                CantidadDisponible,
                Nombre
            FROM equipo
            WHERE IdEquipo = ?
            `,
      [IdEquipo],
    );
    return rows[0] || null;
  },

  async updateStockEquipoConDelta(connection, params, operation) {
    const conn = connection || pool;
    const sql = `
            UPDATE equipo 
            SET 
                CantidadDisponible = CantidadDisponible ${operation === "add" ? "+" : "-"} ?,
                IdEstado = CASE 
                    WHEN (CantidadDisponible ${operation === "add" ? "+" : "-"} ?) <= 0 THEN 4 
                    WHEN (CantidadDisponible ${operation === "add" ? "+" : "-"} ?) > 0 THEN 3
                    ELSE IdEstado 
                END
            WHERE IdEquipo = ?
        `;
    return conn.query(sql, params);
  },

  async insertMovimientoEquipo(connection, params) {
    const conn = connection || pool;
    const sql = `
            INSERT INTO movimiento_equipo (
                IdEquipo, Fecha, IdTipoMovimiento, Direccion, Cantidad,
                DocumentoReferencia, IdDocumentoOrigen, UsuarioCreacion, FechaRegistro
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
    return conn.query(sql, params);
  },

  async getDetalleRemisionDisponibleParaDevolucion(connection, params) {
    const conn = connection || pool;
    const sql = `
            SELECT
                dr.IdDetalleRemision,
                dr.IdRemision,
                dr.IdEquipo,
                dr.Cantidad AS CantidadArrendada,
                dr.DocumentoSubarrendatario,
                dr.Cantidad - IFNULL(
                    (
                        SELECT SUM(dd2.Cantidad)
                        FROM detalles_devoluciones dd2
                        JOIN devoluciones d2 ON dd2.IdDevolucion = d2.IdDevolucion
                        WHERE dd2.IdDetalleRemision = dr.IdDetalleRemision
                        AND d2.IdEstado IN (1, 2)
                        AND d2.IdDevolucion <> ?
                    ),
                    0
                ) AS CantidadDisponibleParaDevolver
            FROM detalles_remisiones dr
            JOIN remisiones r ON dr.IdRemision = r.IdRemision
            WHERE dr.IdDetalleRemision = ?
            AND r.DocumentoCliente = ?
            AND r.IdProyecto = ?
            LIMIT 1
        `;
    const [rows] = await conn.query(sql, params);
    return rows[0] || null;
  },

  async getDetallesDevolucionConPropietario(connection, IdDevolucion) {
    const conn = connection || pool;
    const sql = `
            SELECT 
                dd.IdEquipo,
                dd.Cantidad,
                dr.DocumentoSubarrendatario
            FROM detalles_devoluciones dd
            JOIN detalles_remisiones dr ON dd.IdDetalleRemision = dr.IdDetalleRemision
            WHERE dd.IdDevolucion = ?
        `;
    const [rows] = await conn.query(sql, [IdDevolucion]);
    return rows;
  },

  async deleteDevolucion(connection, params) {
    const conn = connection || pool;
    const sql = `
            DELETE FROM devoluciones
            WHERE IdDevolucion = ?
        `;
    return conn.query(sql, params);
  },

  async deleteDetallesDevolucion(connection, IdDevolucion) {
    const conn = connection || pool;
    const sql = `
            DELETE FROM detalles_devoluciones
            WHERE IdDevolucion = ?
        `;
    return conn.query(sql, [IdDevolucion]);
  },
};

module.exports = ActualizarDevolucionQuery;
