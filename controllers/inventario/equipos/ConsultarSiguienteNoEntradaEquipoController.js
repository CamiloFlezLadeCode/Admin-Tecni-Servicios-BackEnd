const { ConsultarSiguienteNoEntradaEquipoService } = require('../../../services/inventario/equipos/ConsultarSiguienteNoEntradaEquipoService');

const ConsultarSiguienteNoEntradaEquipoController = async (req, res) => {
    try {
        const SiguienteNoEntradaEquipo = await ConsultarSiguienteNoEntradaEquipoService();
        return res.status(200).json(SiguienteNoEntradaEquipo);
    } catch (error) {
        console.error('Error en ConsultarSiguienteNoEntradaEquipoController => ', error.message);
        return res.status(500).json({ error: `Error al consultar el siguiente número entrada de equipo => ${error.message}` });
    }
};
module.exports = {
    ConsultarSiguienteNoEntradaEquipoController
};