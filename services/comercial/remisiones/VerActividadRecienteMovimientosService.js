const { VerActividadRecienteMovimientosQuery } = require('../../../queries/comercial/remisiones/VerActividadRecienteMovimientosQuery');

const LimitarEntero = (valor, defecto, minimo, maximo) => {
    const numero = Number(valor);
    if (!Number.isFinite(numero)) return defecto;
    const entero = Math.trunc(numero);
    return Math.min(maximo, Math.max(minimo, entero));
};

const VerActividadRecienteMovimientosService = async ({ Limite }) => {
    const LimiteSeguro = LimitarEntero(Limite, 10, 1, 50);
    const Filas = await VerActividadRecienteMovimientosQuery({ Limite: LimiteSeguro });

    return {
        Limite: LimiteSeguro,
        Cantidad: Filas.length,
        Movimientos: Filas
    };
};

module.exports = {
    VerActividadRecienteMovimientosService
};

