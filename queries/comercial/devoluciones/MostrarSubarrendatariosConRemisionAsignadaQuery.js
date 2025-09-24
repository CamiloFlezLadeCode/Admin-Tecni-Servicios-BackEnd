const { query } = require('../../../config/db');

const MostrarSubarrendatariosConRemisionAsignadaQuery = async (DatosConsulta) => {
    const sql = `
        SELECT	
            usu.DocumentoUsuario AS DocumentoSubarrendatario,
            CONCAT(COALESCE(usu.Nombres, ''), ' ', COALESCE(usu.Apellidos, '')) AS	Subarrendatario
        FROM
            remisiones AS remi 
        INNER JOIN
            detalles_remisiones AS detaremi ON remi.IdRemision = detaremi.IdRemision
        INNER JOIN
            usuario AS usu ON detaremi.DocumentoSubarrendatario = usu.DocumentoUsuario
        INNER JOIN
            proyectos AS proye ON remi.IdProyecto = proye.IdProyecto
        WHERE
            (remi.DocumentoCliente = ?) AND (remi.IdProyecto = ?)
        GROUP BY
	        usu.DocumentoUsuario
    `;
    return query(sql, [
        DatosConsulta.DocumentoCliente,
        DatosConsulta.IdProyecto
    ]);
};
module.exports = {
    MostrarSubarrendatariosConRemisionAsignadaQuery
};