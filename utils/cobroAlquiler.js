/**
 * FÓRMULA ÚNICA DE COBRO DEL ALQUILER.
 *
 * La usan movimientos generales (valor por remisión) y el estado de cuenta (valor por
 * renglón de remisión). Antes cada una tenía su propio cálculo y daban cifras distintas
 * para la misma remisión; cualquier cambio a la regla de cobro se hace AQUÍ.
 *
 * Reglas:
 *   · Precio: `PrecioUnidad` del renglón, tarifa por unidad y por día.
 *   · Días cobrados entre dos fechas = máx(1, techo(horas completas / 24)):
 *       cualquier fracción de día se cobra como día completo y el mínimo es 1 día.
 *   · Unidades devueltas: se cobran desde la fecha de la remisión hasta la fecha de SU
 *       devolución. Unidades aún en obra: hasta hoy (hora de Colombia).
 *   · Devoluciones que cuentan: las no anuladas/canceladas, asociadas al renglón exacto
 *       de la remisión (IdDetalleRemision), no sólo al equipo.
 *   · IVA: el % de la remisión, sobre el alquiler. Transporte: se suma aparte, sin IVA.
 *
 * Las funciones devuelven fragmentos SQL; los alias de tabla se pasan como parámetro.
 */

/** Hora actual de Colombia (UTC-5, sin horario de verano). Las fechas se guardan en hora local. */
const SQL_AHORA_COLOMBIA = `DATE_ADD(UTC_TIMESTAMP(), INTERVAL -5 HOUR)`;

/** Estados que NO anulan un documento. */
const SQL_ESTADOS_VIGENTES = `(SELECT IdEstado FROM estado WHERE Estado NOT LIKE '%Anulado%' AND Estado NOT LIKE '%Cancelado%')`;

/** Días cobrados entre dos fechas (ver reglas arriba). */
const sqlDiasCobrados = (desde, hasta) =>
    `GREATEST(1, CEIL(TIMESTAMPDIFF(HOUR, ${desde}, ${hasta}) / 24))`;

/** Unidades devueltas (vigentes) de un renglón de remisión. */
const sqlCantidadDevuelta = (dr) => `COALESCE((
        SELECT SUM(ddc.Cantidad)
        FROM detalles_devoluciones ddc
        INNER JOIN devoluciones dc ON ddc.IdDevolucion = dc.IdDevolucion
        WHERE ddc.IdDetalleRemision = ${dr}.IdDetalleRemision
          AND dc.IdEstado IN ${SQL_ESTADOS_VIGENTES}
    ), 0)`;

/**
 * Unidades·día cobradas de un renglón: Σ(unidades devueltas × días hasta su devolución)
 * + (unidades en obra × días hasta hoy). Multiplicado por el precio da el alquiler sin IVA.
 */
const sqlUnidadesDia = (r, dr) => `(
        COALESCE((
            SELECT SUM(ddu.Cantidad * ${sqlDiasCobrados(`${r}.FechaRemision`, 'du.FechaDevolucion')})
            FROM detalles_devoluciones ddu
            INNER JOIN devoluciones du ON ddu.IdDevolucion = du.IdDevolucion
            WHERE ddu.IdDetalleRemision = ${dr}.IdDetalleRemision
              AND du.IdEstado IN ${SQL_ESTADOS_VIGENTES}
        ), 0)
        + (${dr}.Cantidad - ${sqlCantidadDevuelta(dr)}) * ${sqlDiasCobrados(`${r}.FechaRemision`, SQL_AHORA_COLOMBIA)}
    )`;

/** Factor de IVA de una remisión: 1 + IVA/100. */
const sqlFactorIVA = (r) => `(1 + COALESCE(${r}.IVA, 0) / 100)`;

module.exports = {
    SQL_AHORA_COLOMBIA,
    SQL_ESTADOS_VIGENTES,
    sqlDiasCobrados,
    sqlCantidadDevuelta,
    sqlUnidadesDia,
    sqlFactorIVA,
};
