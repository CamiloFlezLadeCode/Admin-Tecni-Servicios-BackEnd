const { mapearDatos } = require('../../../utils/paginacion');
const { VerStockRepuestosQuery, VerStockRepuestosPaginadoQuery } = require('../../../queries/inventario/repuestos/VerStockRepuestosQuery');

/** Forma de cada fila que espera el frontend (se usa en ambos modos). */
const mapearFila = (r) => ({
        IdRepuesto: r.IdRepuesto,
        NombreRepuesto: r.NombreRepuesto ?? null,
        Categoria: null,
        CantidadDisponible: r.CantidadDisponible ?? null,
        UnidadMedida: null,
        Estado: r.Estado ?? null
    });

const VerStockRepuestosService = async () => {
    const rows = await VerStockRepuestosQuery();
    return rows.map(mapearFila);
};

const VerStockRepuestosPaginadoService = async (paginacion, filtros) => {
    return mapearDatos(await VerStockRepuestosPaginadoQuery(paginacion, filtros), mapearFila);
};
module.exports = {
    VerStockRepuestosService,
    VerStockRepuestosPaginadoService
};