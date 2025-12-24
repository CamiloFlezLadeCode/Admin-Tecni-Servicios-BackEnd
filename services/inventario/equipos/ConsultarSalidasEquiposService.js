const { ConsultarSalidasEquiposQuery } = require('../../../queries/inventario/equipos/ConsultarSalidasEquiposQuery');

const ConsultarSalidasEquiposService = async () => {
    const rows = await ConsultarSalidasEquiposQuery();
    return rows.map(r => ({
        NoSalidaEquipos: r.NoSalidaEquipos,
        FechaSalida: r.FechaSalida,
        Responsable: r.Responsable,
        NombreResponsable: r.NombreResponsable,
        Observaciones: r.Observaciones,
        UsuarioCreacion: r.UsuarioCreacion,
        CreadoPor: r.CreadoPor,
        FechaCreacion: r.FechaCreacion,
        TipoMovimiento: r.TipoMovimiento
    }));
};
module.exports = {
    ConsultarSalidasEquiposService
};
