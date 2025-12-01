const { ConsultarSalidasRepuestosQuery } = require('../../../queries/inventario/repuestos/ConsultarSalidasRepuestosQuery');

const ConsultarSalidasRepuestosService = async () => {
    const rows = await ConsultarSalidasRepuestosQuery();
    return rows.map(r => ({
        NoSalidaRepuestos: r.NoSalidaRepuestos,
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
    ConsultarSalidasRepuestosService
};