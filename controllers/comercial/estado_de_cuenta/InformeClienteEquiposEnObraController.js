const { InformeClienteEquiposEnObraService } = require('../../../services/comercial/estado_de_cuenta/InformeClienteEquiposEnObraService');

const InformeClienteEquiposEnObraController = async (req, res) => {
    try {
        const { DocumentoCliente } = req.query;

        if (!DocumentoCliente) {
            return res.status(400).json({
                success: false,
                message: 'El documento del cliente es requerido'
            });
        }

        const data = await InformeClienteEquiposEnObraService(req.query);
        console.log(`Informe cliente (equipos en obra) obtenido correctamente. Total proyectos: ${data.length}`);
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error en InformeClienteEquiposEnObraController => ', error.message);
        return res.status(500).json({ error: `Error al consultar informe cliente => ${error.message}` });
    }
};

module.exports = {
    InformeClienteEquiposEnObraController
};

