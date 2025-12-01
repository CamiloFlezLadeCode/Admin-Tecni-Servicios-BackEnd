const { ListarTiposMovimientoRepuestoQuery } = require('../../queries/generales/TiposMovimientoRepuestoQuery');

const ListarTiposMovimientoRepuestoService = async () => {
    const tipos = await ListarTiposMovimientoRepuestoQuery();
    return tipos.map(t => ({
        IdTipoMovimiento: t.IdTipoMovimiento,
        Nombre: t.Nombre,
        Direccion: t.Direccion
    }));
};
module.exports = {
    ListarTiposMovimientoRepuestoService
};