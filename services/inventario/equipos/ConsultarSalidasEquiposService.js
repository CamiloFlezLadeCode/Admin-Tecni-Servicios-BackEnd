const { mapearDatos } = require('../../../utils/paginacion');
const { ConsultarSalidasEquiposQuery, ConsultarSalidasEquiposPaginadoQuery } = require('../../../queries/inventario/equipos/ConsultarSalidasEquiposQuery');

/** Forma de cada fila que espera el frontend (se usa en ambos modos). */
const mapearFila = (r) => ({
        NoSalidaEquipos: r.NoSalidaEquipos,
        FechaSalida: r.FechaSalida,
        Responsable: r.Responsable,
        NombreResponsable: r.NombreResponsable,
        Observaciones: r.Observaciones,
        UsuarioCreacion: r.UsuarioCreacion,
        CreadoPor: r.CreadoPor,
        FechaCreacion: r.FechaCreacion,
        TipoMovimiento: r.TipoMovimiento
    });

const ConsultarSalidasEquiposService = async () => {
    const rows = await ConsultarSalidasEquiposQuery();
    return rows.map(mapearFila);
};

const ConsultarSalidasEquiposPaginadoService = async (paginacion) => {
    return mapearDatos(await ConsultarSalidasEquiposPaginadoQuery(paginacion), mapearFila);
};
module.exports = {
    ConsultarSalidasEquiposService,
    ConsultarSalidasEquiposPaginadoService
};
