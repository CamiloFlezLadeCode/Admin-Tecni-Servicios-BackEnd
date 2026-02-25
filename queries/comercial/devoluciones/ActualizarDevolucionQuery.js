const { pool } = require('../../../config/db');

const ActualizarDevolucionQuery = {
    async getDevolucionById(connection, IdDevolucion) {
        const conn = connection || pool;
        const [rows] = await conn.query(
            `SELECT 
                IdDevolucion,
                NoDevolucion,
                Observaciones,
                PersonaQueRecibe,
                PersonaQueEntrega,
                IncluyeTransporte,
                ValorTransporte,
                FechaDevolucion,
                IdEstado
            FROM devoluciones
            WHERE IdDevolucion = ?`,
            [IdDevolucion]
        );
        return rows[0] || null;
    },

    async getDetallesDevolucion(connection, IdDevolucion) {
        const conn = connection || pool;
        const [rows] = await conn.query(
            `SELECT 
                IdDetalleDevolucion,
                IdDevolucion,
                IdEquipo,
                Cantidad,
                IdEstado
            FROM detalles_devoluciones
            WHERE IdDevolucion = ?`,
            [IdDevolucion]
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
            [IdEquipo]
        );
        return rows[0] || null;
    },

    async updateStockEquipoConDelta(connection, params, operation) {
        const conn = connection || pool;
        const sql = `
            UPDATE equipo 
            SET 
                CantidadDisponible = CantidadDisponible ${operation === 'add' ? '+' : '-'} ?,
                IdEstado = CASE 
                    WHEN (CantidadDisponible ${operation === 'add' ? '+' : '-'} ?) <= 0 THEN 4 
                    WHEN (CantidadDisponible ${operation === 'add' ? '+' : '-'} ?) > 0 THEN 3
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
    }
};

module.exports = ActualizarDevolucionQuery;
