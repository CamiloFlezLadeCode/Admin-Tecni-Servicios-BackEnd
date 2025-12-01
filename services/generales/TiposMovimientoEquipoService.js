const { ListarTiposMovimientoEquipoQuery } = require('../../queries/generales/TiposMovimientoEquipoQuery');

const ListarTiposMovimientoEquipoService = async () => {
    const tipos = await ListarTiposMovimientoEquipoQuery();
    return tipos.map(t => ({
        IdTipoMovimiento: t.IdTipoMovimiento,
        Nombre: t.Nombre,
        Direccion: t.Direccion
    }));
};
module.exports = {
    ListarTiposMovimientoEquipoService
};