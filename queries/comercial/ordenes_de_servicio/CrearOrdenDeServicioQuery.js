// const { query, pool } = require('../../../config/db');
// const { FechaActualColombia } = require('../../../utils/FechaActualColombia');

// const CrearOrdenDeServicioQuery = async (DatosOrdenDeServicio) => {
//     const sql = `
//         INSERT INTO 
//             ordenes_de_servicio 
//                 (
//                     NoOrdenDeServicio, 
//                     DocumentoCliente, 
//                     IdProyecto, 
//                     Garantia, 
//                     Descripcion, 
//                     Observaciones, 
//                     DocumentoMecanico, 
//                     PersonaQueEntrega, 
//                     PersonaQueRecibe, 
//                     UsuarioCreacion, 
//                     FechaCreacion, 
//                     IdEstado
//                 ) 
//         VALUES 
//             ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? );
//     `;
//     return query(sql, [
//         DatosOrdenDeServicio.NoOrdenDeServicio,
//         DatosOrdenDeServicio.DocumentoCliente,
//         DatosOrdenDeServicio.IdProyecto,
//         DatosOrdenDeServicio.Garantia,
//         DatosOrdenDeServicio.Descripcion,
//         DatosOrdenDeServicio.Observaciones,
//         DatosOrdenDeServicio.DocumentoMecanico,
//         DatosOrdenDeServicio.PersonaQueEntrega,
//         DatosOrdenDeServicio.PersonaQueRecibe,
//         DatosOrdenDeServicio.UsuarioCreacion,
//         FechaActualColombia(),
//         DatosOrdenDeServicio.IdEstado
//     ]);
// };
// module.exports = {
//     CrearOrdenDeServicioQuery
// };


const { query, pool } = require('../../../config/db');
const { FechaActualColombia } = require('../../../utils/FechaActualColombia');

const CrearOrdenDeServicioQuery = async (DatosOrdenDeServicio) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        // Se realiza inserción en la tabla principal [ordenes_de_servicio]
        const InsertarOrdenDeServicio = `
            INSERT INTO 
                ordenes_de_servicio 
                    (
                        NoOrdenDeServicio, 
                        DocumentoCliente, 
                        IdProyecto, 
                        Garantia, 
                        Descripcion, 
                        Observaciones, 
                        DocumentoMecanico, 
                        PersonaQueEntrega, 
                        PersonaQueRecibe, 
                        UsuarioCreacion, 
                        FechaCreacion, 
                        IdEstado
                    ) 
            VALUES 
                ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? );
        `;
        const [ResultadoOrdenDeServicio] = await connection.query(InsertarOrdenDeServicio, [
            DatosOrdenDeServicio.NoOrdenDeServicio,
            DatosOrdenDeServicio.DocumentoCliente,
            DatosOrdenDeServicio.IdProyecto,
            DatosOrdenDeServicio.Garantia,
            DatosOrdenDeServicio.Descripcion,
            DatosOrdenDeServicio.Observaciones,
            DatosOrdenDeServicio.DocumentoMecanico,
            DatosOrdenDeServicio.PersonaQueEntrega,
            DatosOrdenDeServicio.PersonaQueRecibe,
            DatosOrdenDeServicio.UsuarioCreacion,
            FechaActualColombia(),
            DatosOrdenDeServicio.IdEstado
        ]);
        // ...

        // Se captura el id de la orden de servicio creada
        const IdOrdenDeServicio = ResultadoOrdenDeServicio.insertId;
        if (!IdOrdenDeServicio) throw new Error('No se pudo obtener el ID de la orden de servicio.');
        // ...

        // Se inserta información en tabla secundaria [detalles_orden_de_servivio]
        const InsertarDetallesOrdenDeServicio = `
            INSERT INTO 
                detalles_ordenes_de_servicio 
                    (
                        IdOrdenDeServicio, 
                        Cantidad, 
                        DescripcionEquipo
                    ) 
            VALUES 
                ( ?, ?, ? );
        `;
        for (const detalle of DatosOrdenDeServicio.Detalles) {
            await connection.query(InsertarDetallesOrdenDeServicio, [
                IdOrdenDeServicio,
                detalle.Cantidad,
                detalle.DescripcionEquipo
            ]);
        };
        // ...

        // Se confirman todos los cambios
        await connection.commit();
        // ...

        // Se retorna resultado exitoso
        return { success: true, IdOrdenDeServicio };
        // ...
    } catch (error) {
        await connection.rollback();
        console.error('Error al crear la orden de servicio: ', error);
        throw new Error('Error al crear la orden de servicio');
    } finally {
        connection.release(); //Liberar conexión
    }
};

module.exports = {
    CrearOrdenDeServicioQuery
};