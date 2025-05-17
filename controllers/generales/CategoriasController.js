const { ListarCategoriasService } = require('../../services/generales/CategoriasService');

const ListarCategoriasController = async (req, res) => {
    try {
        const data = await ListarCategoriasService();
        console.log(`Categorias obtenidas correctamente. Total: ${data.length}`);
        const Categorias = data.map(Categoria => ({
            value: Categoria.IdCategoria,
            label: Categoria.Categoria
        }));
        res.status(200).json(Categorias);
    } catch (error) {
        console.error('Error en ListarCategoriasController => ', error);
        res.status(500).json({ error: `Error al listar las categorias => error` });
    }
};
module.exports = {
    ListarCategoriasController
};