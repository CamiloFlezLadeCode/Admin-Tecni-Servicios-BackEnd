const { GuardarSalidaEquiposService } = require('../../../services/inventario/equipos/GuardarSalidaEquiposService');

const GuardarSalidaEquiposController = async (req, res) => {
    try {
        const DataSalidaEquipos = req.body;
        console.log(DataSalidaEquipos)
        if (!DataSalidaEquipos || !DataSalidaEquipos.Equipos || DataSalidaEquipos.Equipos.length === 0) {
            return res.status(400).json({ error: 'Datos de salida inválidos o vacíos' });
        }
        const Resultado = await GuardarSalidaEquiposService(DataSalidaEquipos);
        return res.status(200).json(Resultado);
    } catch (error) {
        console.error('Error en GuardarSalidaEquiposController => ', error.message);
        return res.status(500).json({ error: `Error al guardar la salida de equipos => ${error.message}` });
    }
};
module.exports = {
    GuardarSalidaEquiposController
};
