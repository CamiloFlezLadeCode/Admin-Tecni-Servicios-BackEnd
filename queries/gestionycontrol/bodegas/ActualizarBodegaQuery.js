const { query } = require('../../../config/db');

const ActualizarBodegaQuery = async (NuevosDatosBodega) => {
    const sql = `
        UPDATE 
            bodegas 
        SET 
            NombreBodega = ?, 
            Descripcion = ?, 
            IdTipoBodega = ?, 
            IdEstado = ? 
        WHERE 
            bodegas.IdBodega = ?;
    `;
    return query(sql, [
        NuevosDatosBodega.NombreDeBodega,
        NuevosDatosBodega.Descripcion,
        NuevosDatosBodega.TipoDeBodega,
        NuevosDatosBodega.Estado,
        NuevosDatosBodega.IdBodega,
    ]);
};
module.exports = {
    ActualizarBodegaQuery
};