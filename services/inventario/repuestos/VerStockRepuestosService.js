const { VerStockRepuestosQuery } = require('../../../queries/inventario/repuestos/VerStockRepuestosQuery');

const VerStockRepuestosService = async () => {
    const rows = await VerStockRepuestosQuery();
    return rows.map(r => ({
        IdRepuesto: r.IdRepuesto,
        NombreRepuesto: r.NombreRepuesto ?? null,
        Categoria: null,
        CantidadDisponible: r.CantidadDisponible ?? null,
        UnidadMedida: null,
        Estado: r.Estado ?? null
    }));
};
module.exports = {
    VerStockRepuestosService
};