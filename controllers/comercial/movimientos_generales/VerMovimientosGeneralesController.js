const { leerPaginacion } = require('../../../utils/paginacion');
const { VerMovimientosGeneralesService, VerMovimientosGeneralesPaginadoService } = require('../../../services/comercial/movimientos_generales/VerMovimientosGeneralesService');

const VerMovimientosGeneralesController = async (req, res) => {
    try {
        const filtros = {
            FechaInicio: req.query.FechaInicio,
            FechaFin: req.query.FechaFin,
            DocumentoCliente: req.query.DocumentoCliente,
            IdProyecto: req.query.IdProyecto
        };

        // Con `pagina` responde paginado (con el resumen de todo el conjunto); sin ella, lo de siempre.
        const paginacion = leerPaginacion(req.query);
        if (paginacion) {
            return res.status(200).json(await VerMovimientosGeneralesPaginadoService(filtros, paginacion));
        }

        const movimientos = await VerMovimientosGeneralesService(filtros);
// console.log(`Movimientos generales consultados correctamente. Total: ${movimientos.length}`);
        return res.status(200).json(movimientos);
    } catch (error) {
        console.error('Error en VerMovimientosGeneralesController => ', error);
        return res.status(500).json({
            success: false,
            error: `Error al consultar los movimientos generales => ${error.message}`
        });
    }
};

module.exports = {
    VerMovimientosGeneralesController
};
