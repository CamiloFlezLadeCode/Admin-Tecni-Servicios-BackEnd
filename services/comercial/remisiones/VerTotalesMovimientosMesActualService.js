const { VerTotalesMovimientosMesActualQuery } = require('../../../queries/comercial/remisiones/VerTotalesMovimientosMesActualQuery');

const FormatearFechaSoloFechaLocal = (fecha) => {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
};

const ObtenerAnioMes = (fecha) => {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    return `${anio}-${mes}`;
};

const VerTotalesMovimientosMesActualService = async () => {
    const ahora = new Date();
    const FechaInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const FechaFinExclusiva = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 1);

    const {
        CantidadRemisiones,
        CantidadDevoluciones,
        CantidadOrdenesDeServicio
    } = await VerTotalesMovimientosMesActualQuery({ FechaInicio, FechaFinExclusiva });

    const TotalMovimientos = CantidadRemisiones + CantidadDevoluciones + CantidadOrdenesDeServicio;

    return {
        Mes: ObtenerAnioMes(FechaInicio),
        FechaInicio: FormatearFechaSoloFechaLocal(FechaInicio),
        FechaFinExclusiva: FormatearFechaSoloFechaLocal(FechaFinExclusiva),
        Totales: {
            CantidadRemisiones,
            CantidadDevoluciones,
            CantidadOrdenesDeServicio
        },
        TotalMovimientos
    };
};

module.exports = {
    VerTotalesMovimientosMesActualService
};

