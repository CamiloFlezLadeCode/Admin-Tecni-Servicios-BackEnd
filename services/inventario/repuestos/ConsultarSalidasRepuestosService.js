const { mapearDatos } = require('../../../utils/paginacion');
const { ConsultarSalidasRepuestosQuery, ConsultarSalidasRepuestosPaginadoQuery } = require('../../../queries/inventario/repuestos/ConsultarSalidasRepuestosQuery');

/** Forma de cada fila que espera el frontend (se usa en ambos modos). */
const mapearFila = (r) => ({
        NoSalidaRepuestos: r.NoSalidaRepuestos,
        FechaSalida: r.FechaSalida,
        Responsable: r.Responsable,
        NombreResponsable: r.NombreResponsable,
        Observaciones: r.Observaciones,
        UsuarioCreacion: r.UsuarioCreacion,
        CreadoPor: r.CreadoPor,
        FechaCreacion: r.FechaCreacion,
        TipoMovimiento: r.TipoMovimiento
    });

const ConsultarSalidasRepuestosService = async () => {
    const rows = await ConsultarSalidasRepuestosQuery();
    return rows.map(mapearFila);
};

const ConsultarSalidasRepuestosPaginadoService = async (paginacion) => {
    return mapearDatos(await ConsultarSalidasRepuestosPaginadoQuery(paginacion), mapearFila);
};
module.exports = {
    ConsultarSalidasRepuestosService,
    ConsultarSalidasRepuestosPaginadoService
};