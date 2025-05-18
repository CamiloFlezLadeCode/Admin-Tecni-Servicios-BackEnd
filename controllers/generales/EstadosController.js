const { ListarEstadosService } = require('../../services/generales/EstadosService');

const ListarEstadosController = async (req, res) => {
    try {
        const data = await ListarEstadosService();
        if(data) {
            console.log(`Estados obtenidos correctamente. Total: ${data.length}`);
            const Estados = data.map(Estado => ({
                value: Estado.IdEstado,
                label: Estado.Estado
            }));
            res.status(200).json(Estados);
        }
    } catch (error) {
        console.error('Error en ListarEstadosController => ', error);
        res.status(500).json({ error: `Error al crear equipo => error` });
    }
};
module.exports = {
    ListarEstadosController
};