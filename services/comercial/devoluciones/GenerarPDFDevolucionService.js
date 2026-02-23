const { GenerarPDFDevolucionQuery } = require('../../../queries/comercial/devoluciones/GenerarPDFDevolucionQuery');

const GenerarPDFDevolucionService = async (IdDevolucion) => {
    const infoDevolucion = await GenerarPDFDevolucionQuery(IdDevolucion);

    if (!infoDevolucion || infoDevolucion.length === 0) {
        throw new Error('No se encontró la devolución con el ID proporcionado');
    }

    const mapaEquipos = new Map();

    for (const detalle of infoDevolucion) {
        const id = detalle.IdEquipo;

        if (mapaEquipos.has(id)) {
            const existente = mapaEquipos.get(id);
            existente.CantidadEntregada += detalle.CantidadEntregada;
        } else {
            mapaEquipos.set(id, { ...detalle });
        }
    }

    const infoDevolucionAgrupada = Array.from(mapaEquipos.values());

    return infoDevolucionAgrupada;
};
module.exports = {
    GenerarPDFDevolucionService
};