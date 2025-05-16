const { ListarCategoriasService } = require('../../services/generales/CategoriasService');

const ListarCategoriasController = async (req, res) => {
    try {
        const data = await ListarCategoriasService();
        console.log("Referencias obtenidas correctamente.");
        const Referencias = data.map(Referencia => ({
            value: Referencia.IdCategoria,
            label: Referencia.Categoria
        }));
        res.status(200).json(Referencias);
    } catch (error) {
        console.error('Error en ListarCategoriasController => ', error);
        res.status(500).json({ error: `Error al listar las referencias => error` });
    }
};
module.exports = {
    ListarCategoriasController
};