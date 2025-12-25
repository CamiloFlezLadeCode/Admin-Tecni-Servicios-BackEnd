const { InformeInternoEmpresaEquiposEnObraService } = require('../../../services/comercial/estado_de_cuenta/InformeInternoEmpresaEquiposEnObraService');

const InformeInternoEmpresaEquiposEnObraController = async (req, res) => {
    try {
        const { DocumentoCliente } = req.query;

        if (!DocumentoCliente) {
            return res.status(400).json({
                success: false,
                message: 'El documento del cliente es requerido'
            });
        }

        const data = await InformeInternoEmpresaEquiposEnObraService(req.query);
        console.log(`Informe interno (equipos en obra) obtenido correctamente. Total proyectos: ${data.length}`);
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error en InformeInternoEmpresaEquiposEnObraController => ', error.message);
        return res.status(500).json({ error: `Error al consultar informe interno => ${error.message}` });
    }
};

module.exports = {
    InformeInternoEmpresaEquiposEnObraController
};

