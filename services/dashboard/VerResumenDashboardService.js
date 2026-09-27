const {
    ContarClientesQuery,
    ContarProyectosQuery,
    ResumenInventarioQuery,
    TopClientesQuery
} = require('../../queries/dashboard/VerResumenDashboardQuery');
const { VerCantidadRemisionesYDevolucionesUltimos6MesesService } = require('../comercial/remisiones/VerCantidadRemisionesYDevolucionesUltimos6MesesService');
const { VerTotalesMovimientosMesActualService } = require('../comercial/remisiones/VerTotalesMovimientosMesActualService');
const { VerActividadRecienteMovimientosService } = require('../comercial/remisiones/VerActividadRecienteMovimientosService');

const LIMITE_TOP_CLIENTES = 6;
const LIMITE_ACTIVIDAD_RECIENTE = 10;

/**
 * Todo lo que pinta el panel principal en una sola respuesta de tamaño fijo.
 * Reutiliza los servicios de agregados que ya existían (serie de 6 meses,
 * totales del mes, actividad reciente) y suma los conteos que antes el front
 * calculaba descargando los listados completos.
 */
const VerResumenDashboardService = async () => {
    const [
        TotalClientes,
        Proyectos,
        Inventario,
        TopClientes,
        SerieUltimos6Meses,
        TotalesMesActual,
        ActividadReciente
    ] = await Promise.all([
        ContarClientesQuery(),
        ContarProyectosQuery(),
        ResumenInventarioQuery(),
        TopClientesQuery(LIMITE_TOP_CLIENTES),
        VerCantidadRemisionesYDevolucionesUltimos6MesesService(),
        VerTotalesMovimientosMesActualService(),
        VerActividadRecienteMovimientosService({ Limite: LIMITE_ACTIVIDAD_RECIENTE })
    ]);

    return {
        TotalClientes,
        Proyectos,
        Inventario,
        TopClientes: TopClientes.map((fila) => ({
            DocumentoCliente: fila.DocumentoCliente,
            Cliente: fila.Cliente,
            CantidadRemisiones: Number(fila.CantidadRemisiones) || 0,
            CantidadDevoluciones: Number(fila.CantidadDevoluciones) || 0,
            Total: Number(fila.Total) || 0
        })),
        SerieUltimos6Meses,
        TotalesMesActual,
        ActividadReciente
    };
};

module.exports = {
    VerResumenDashboardService
};
