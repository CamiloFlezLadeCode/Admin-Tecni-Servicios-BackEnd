const { ConsultarSiguienteNoSalidaEquipoService } = require('../../../services/inventario/equipos/ConsultarSiguienteNoSalidaEquipoService');

const ConsultarSiguienteNoSalidaEquipoController = async (req, res) => {
    try {
        const SiguienteNoSalidaEquipo = await ConsultarSiguienteNoSalidaEquipoService();
        return res.status(200).json(SiguienteNoSalidaEquipo);
    } catch (error) {
        console.error('Error en ConsultarSiguienteNoSalidaEquipoController => ', error.message);
        return res.status(500).json({ error: `Error al consultar el siguiente número salida de equipo => ${error.message}` });
    }
};
module.exports = {
    ConsultarSiguienteNoSalidaEquipoController
};
