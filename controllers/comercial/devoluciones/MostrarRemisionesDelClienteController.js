const { MostrarRemisionesDelClienteService } = require('../../../services/comercial/devoluciones/MostrarRemisionesDelClienteService');

const MostrarRemisionesDelClienteController = async (req, res) => {
    try {
        const Datos = req.query;
        const Remisiones = await MostrarRemisionesDelClienteService(Datos);
        console.log(`Remisiones del cliente obtenidas correctamente - Total: ${Remisiones.length}`)
        const RemisionesMapeadas = Remisiones.map(remision => ({
            label: remision.NoRemision,
            value: remision.IdRemision
        }));
        return res.status(200).json(
            RemisionesMapeadas
        );
    } catch (error) {
        console.error('Error en MostrarRemisionesDelClienteController => ', error);
        res.status(500).json({ error: `Error al consultar las remisiones del cliente => ${error}` });
    }
};
module.exports = {
    MostrarRemisionesDelClienteController
};