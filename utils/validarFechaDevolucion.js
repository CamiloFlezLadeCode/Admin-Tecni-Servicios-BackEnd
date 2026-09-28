/**
 * Una devolución no puede tener fecha anterior a la de las remisiones de los equipos
 * que devuelve: un equipo no puede volver antes de haber salido. Sin esta validación
 * se registraron devoluciones el mismo día con una hora anterior a la remisión (p. ej.
 * remisión 1643 a las 12:48 y devolución 1615 a las 07:56), que en el estado de cuenta
 * aparecían como tiempo negativo.
 *
 * Se compara a nivel de MINUTO: el selector de fecha no tiene segundos, así que una
 * devolución en el mismo minuto de la remisión es válida.
 *
 * La usan la creación y la edición de devoluciones (misma regla en ambos caminos).
 */

/** Error de validación: los controladores lo devuelven con este status en vez de 500. */
class ErrorValidacion extends Error {
    constructor(mensaje) {
        super(mensaje);
        this.name = 'ErrorValidacion';
        this.status = 400;
    }
}

/**
 * Lleva la fecha recibida a 'YYYY-MM-DD HH:mm:ss'. Acepta 'YYYY-MM-DD HH:mm[:ss]',
 * 'YYYY/MM/DD HH:mm[:ss]' (lo que envía la edición) y objetos Date (hora local del
 * servidor, igual que los guarda mysql2). Devuelve null si no es una fecha válida.
 */
const normalizarFecha = (valor) => {
    if (valor instanceof Date) {
        if (Number.isNaN(valor.getTime())) return null;
        const dos = (n) => String(n).padStart(2, '0');
        return `${valor.getFullYear()}-${dos(valor.getMonth() + 1)}-${dos(valor.getDate())} ${dos(valor.getHours())}:${dos(valor.getMinutes())}:${dos(valor.getSeconds())}`;
    }
    const m = String(valor ?? '').trim().match(/^(\d{4})[-/](\d{2})[-/](\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/);
    if (!m) return null;
    return `${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]}:${m[6] ?? '00'}`;
};

/**
 * Lanza ErrorValidacion si alguna de las remisiones indicadas es posterior (al minuto)
 * a la fecha de la devolución.
 *
 * @param {object} connection  Conexión de la transacción en curso.
 * @param {string|Date} FechaDevolucion
 * @param {Array<number|string>} idsRemision  IdRemision de los equipos que se devuelven.
 */
const validarFechaDevolucionContraRemisiones = async (connection, FechaDevolucion, idsRemision) => {
    const fecha = normalizarFecha(FechaDevolucion);
    if (!fecha) {
        throw new ErrorValidacion('La fecha de la devolución no es válida.');
    }

    const ids = [...new Set((idsRemision || []).map(Number).filter((id) => Number.isFinite(id) && id > 0))];
    if (ids.length === 0) return;

    const [posteriores] = await connection.query(
        `SELECT
            r.NoRemision,
            DATE_FORMAT(r.FechaRemision, '%d/%m/%Y %l:%i %p') AS FechaRemision
        FROM remisiones r
        WHERE r.IdRemision IN (?)
          AND DATE_FORMAT(r.FechaRemision, '%Y-%m-%d %H:%i') > DATE_FORMAT(?, '%Y-%m-%d %H:%i')
        ORDER BY r.FechaRemision, r.NoRemision`,
        [ids, fecha]
    );

    if (posteriores.length === 0) return;

    const [[{ FechaDevolucionTexto }]] = await connection.query(
        `SELECT DATE_FORMAT(?, '%d/%m/%Y %l:%i %p') AS FechaDevolucionTexto`,
        [fecha]
    );
    const lista = posteriores.map((r) => `No. ${r.NoRemision} (${r.FechaRemision})`).join(', ');
    const plural = posteriores.length > 1;
    throw new ErrorValidacion(
        `La fecha de la devolución (${FechaDevolucionTexto}) es anterior a la fecha de ${plural ? 'las remisiones' : 'la remisión'} ${lista}. ` +
        `Un equipo no puede devolverse antes de haber sido remitido: ajuste la fecha de la devolución o quite ${plural ? 'esos equipos' : 'ese equipo'}.`
    );
};

module.exports = {
    ErrorValidacion,
    normalizarFecha,
    validarFechaDevolucionContraRemisiones,
};
