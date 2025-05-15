const { ListarReferenciasService } = require('../../services/generales/ReferenciasService');

const ListarReferenciasController = async (req, res) => {
    try {
        const Referencias = await ListarReferenciasService();
        console.log("Referencias obtenidas correctamente.");
        res.status(200).json(Referencias);
    } catch (error) {
        console.error('Error en ListarReferenciasController => ', error);
        res.status(500).json({ error: `Error al listar las referencias => error` });
    }
};
module.exports = {
    ListarReferenciasController
};