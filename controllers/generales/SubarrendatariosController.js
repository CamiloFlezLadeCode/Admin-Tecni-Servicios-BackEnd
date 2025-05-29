const { ConsultarSubarrendatariosService } = require('../../services/generales/SubarrendatariosService');

const ConsultarSubarrendatariosController = async (req, res) => {
    try {
        const Subarrendatarios = await ConsultarSubarrendatariosService();
        console.log(`Subarrendatarios obtenidos correctamente. Total: ${Subarrendatarios.length}`);
        const SubarrendatariosMapeados = Subarrendatarios.map(subarrendatario => ({
            Id: subarrendatario.IdSubarrendatario,
            value: subarrendatario.DocumentoSubarrendatario,
            label: subarrendatario.NombreSubarrendatario
        }));
        res.status(200).json(SubarrendatariosMapeados);
    } catch (error) {
        console.error('Error en ConsultarSubarrendatariosController => ', error);
        res.status(500).json({ error: `Error al consular subarrendatarios => ${error}` });
    }
};
module.exports = {
    ConsultarSubarrendatariosController
};