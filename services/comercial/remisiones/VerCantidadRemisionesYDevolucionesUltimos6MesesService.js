const { VerCantidadRemisionesYDevolucionesUltimos6MesesQuery } = require('../../../queries/comercial/remisiones/VerCantidadRemisionesYDevolucionesUltimos6MesesQuery');

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

const VerCantidadRemisionesYDevolucionesUltimos6MesesService = async () => {
    const ahora = new Date();
    const FechaInicio = new Date(ahora.getFullYear(), ahora.getMonth() - 5, 1);
    const FechaFinExclusiva = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 1);

    const { remisiones, devoluciones, ordenesDeServicio } = await VerCantidadRemisionesYDevolucionesUltimos6MesesQuery({
        FechaInicio,
        FechaFinExclusiva
    });

    const CantidadPorMesRemisiones = new Map(
        (remisiones || []).map((fila) => [fila.Mes, Number(fila.Cantidad) || 0])
    );
    const CantidadPorMesDevoluciones = new Map(
        (devoluciones || []).map((fila) => [fila.Mes, Number(fila.Cantidad) || 0])
    );
    const CantidadPorMesOrdenesDeServicio = new Map(
        (ordenesDeServicio || []).map((fila) => [fila.Mes, Number(fila.Cantidad) || 0])
    );

    const FormateadorMes = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' });
    const Meses = Array.from({ length: 6 }, (_, indice) => {
        const fechaMes = new Date(FechaInicio.getFullYear(), FechaInicio.getMonth() + indice, 1);
        const Mes = ObtenerAnioMes(fechaMes);
        const CantidadRemisiones = CantidadPorMesRemisiones.get(Mes) ?? 0;
        const CantidadDevoluciones = CantidadPorMesDevoluciones.get(Mes) ?? 0;
        const CantidadOrdenesDeServicio = CantidadPorMesOrdenesDeServicio.get(Mes) ?? 0;

        return {
            Mes,
            Etiqueta: FormateadorMes.format(fechaMes),
            CantidadRemisiones,
            CantidadDevoluciones,
            CantidadOrdenesDeServicio
        };
    });

    const Totales = Meses.reduce(
        (acum, fila) => ({
            CantidadRemisiones: acum.CantidadRemisiones + fila.CantidadRemisiones,
            CantidadDevoluciones: acum.CantidadDevoluciones + fila.CantidadDevoluciones,
            CantidadOrdenesDeServicio: acum.CantidadOrdenesDeServicio + fila.CantidadOrdenesDeServicio
        }),
        { CantidadRemisiones: 0, CantidadDevoluciones: 0, CantidadOrdenesDeServicio: 0 }
    );

    return {
        FechaInicio: FormatearFechaSoloFechaLocal(FechaInicio),
        FechaFinExclusiva: FormatearFechaSoloFechaLocal(FechaFinExclusiva),
        Meses,
        Totales
    };
};

module.exports = {
    VerCantidadRemisionesYDevolucionesUltimos6MesesService
};
