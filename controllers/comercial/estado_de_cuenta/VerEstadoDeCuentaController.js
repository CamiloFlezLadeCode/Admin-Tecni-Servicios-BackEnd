const { VerEstadoDeCuentaService } = require('../../../services/comercial/estado_de_cuenta/VerEstadoDeCuentaService');

const VerEstadoDeCuentaController = async (req, res) => {
    try {
        const { DocumentoCliente } = req.query;

        if (!DocumentoCliente) {
            return res.status(400).json({
                success: false,
                message: 'El documento del cliente es requerido'
            });
        }
        const EstadoDeCuentaCliente = await VerEstadoDeCuentaService(DocumentoCliente);
        console.log(`El estado del cliente se obtuvo correctamente. Total: ${EstadoDeCuentaCliente.length}`);
        return res.status(200).json(EstadoDeCuentaCliente);
    } catch (error) {
        console.error('Error en VerEstadoDeCuentaController => ', error.message);
        return res.status(500).json({ error: `Error al consultar el estado del cliente => ${error.message}` });
    }
};
module.exports = {
    VerEstadoDeCuentaController
};