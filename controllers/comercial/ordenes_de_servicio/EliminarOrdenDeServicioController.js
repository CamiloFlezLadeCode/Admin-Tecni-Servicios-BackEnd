const { EliminarOrdenDeServicioService } = require('../../../services/comercial/ordenes_de_servicio/EliminarOrdenDeServicioService');

const EliminarOrdenDeServicioController = async (req, res) => {
    try {
        await EliminarOrdenDeServicioService();
        console.log(``);
        //return res.status(200).json();
        //return res.status(204).send();
    } catch (error) {
        console.error('Error en EliminarOrdenDeServicioController => ', error.message);
        return res.status(500).json({ error: `Error al => ${error.message}` });
    }
};
module.exports = {
    EliminarOrdenDeServicioController
};