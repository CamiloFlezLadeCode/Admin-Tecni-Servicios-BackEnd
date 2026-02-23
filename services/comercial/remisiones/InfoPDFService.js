const { InfoPDFQuery } = require('../../../queries/comercial/remisiones/InfoPDFQuery');

// const InfoPDFService = async (IdRemision) => {
//     // return await InfoPDFQuery(IdRemision);
//     const infoRemision = await InfoPDFQuery(IdRemision);
//     if (!infoRemision) {
//         throw new Error('No se encontró la remisión con el ID proporcionado');
//     }
//     console.log('infoRemision => ', infoRemision);
//     let ValoresRepetidos = [];
//     for (const detalle of infoRemision) {
//         if (ValoresRepetidos.includes(detalle.IdEquipo)) {
//             ValoresRepetidos.push(...[detalle]);
//         }
//     }
//     console.log('ValoresRepetidos => ', ValoresRepetidos);
//     return infoRemision;
// };

const InfoPDFService = async (IdRemision) => {
    const infoRemision = await InfoPDFQuery(IdRemision);

    if (!infoRemision || infoRemision.length === 0) {
        throw new Error('No se encontró la remisión con el ID proporcionado');
    }

    // Usamos Map para agrupar por IdEquipo (O(1) por operación)
    const mapaEquipos = new Map();

    for (const detalle of infoRemision) {
        const id = detalle.IdEquipo;

        if (mapaEquipos.has(id)) {
            // Si ya existe, sumamos la cantidad
            const existente = mapaEquipos.get(id);
            existente.Cantidad += detalle.Cantidad;
        } else {
            // Si no existe, creamos una copia del objeto
            mapaEquipos.set(id, { ...detalle });
        }
    }

    // Convertimos el Map a array
    const infoRemisionAgrupada = Array.from(mapaEquipos.values());

    console.log('infoRemisionAgrupada => ', infoRemisionAgrupada);
    return infoRemisionAgrupada;
};
module.exports = {
    InfoPDFService
};