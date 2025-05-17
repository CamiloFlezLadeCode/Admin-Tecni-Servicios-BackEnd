const { ConsultarTiposDeDocumentosService } = require('../../services/generales/TipoDocumentoService');

const ConsultarTiposDeDocumentosController = async (req, res) => {
    try {
        const TipoDocumento = await ConsultarTiposDeDocumentosService();
        console.log(`Tipo de documentos cargados correctamente. Total: ${TipoDocumento.length}`);
        const TiposDeDocumentos = TipoDocumento.map(tipo => ({
            value: tipo.IdTipoDocumento,
            label: tipo.Codigo,
            label2: tipo.Nombre
        }));
        res.status(200).json(TiposDeDocumentos);
    } catch (error) {
        console.error('Error en ConsultarTiposDeDocumentosController => ', error);
        res.status(500).json({ error: `Error al crear equipo => ${error}` });
    }
};
module.exports = {
    ConsultarTiposDeDocumentosController
};