const { ListarMunicipiosService } = require('../../services/generales/MunicipiosService');

const ListarMunicipiosController = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search || '';

        const data = await ListarMunicipiosService(page, limit, search);

        return res.json({
            page,
            limit,
            totalItems: data.totalItems,
            totalPages: data.totalPages,
            data: data.rows
        });
    } catch (error) {
        console.error('Error en ListarMunicipiosController => ', error);
        res.status(500).json({ error: `Error al listar los municipios => ${error}` });
    }
};
module.exports = {
    ListarMunicipiosController
}