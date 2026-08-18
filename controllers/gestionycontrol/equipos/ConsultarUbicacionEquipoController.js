const { ConsultarUbicacionEquipoService } = require('../../../services/gestionycontrol/equipos/ConsultarUbicacionEquipoService');

const ConsultarUbicacionEquipoController = async (req, res) => {
    try {
        const { IdEquipo } = req.params;

        // Se valida que sea un entero positivo antes de tocar la base de datos:
        // un id no numérico llegaría a MySQL y devolvería un 500 poco útil.
        const Id = Number(IdEquipo);
        if (!Number.isInteger(Id) || Id <= 0) {
            return res.status(400).json({ error: 'El identificador del equipo no es válido.' });
        }

        const Resultado = await ConsultarUbicacionEquipoService(Id);

        if (!Resultado) {
            return res.status(404).json({ error: 'No se encontró el equipo solicitado.' });
        }

        return res.status(200).json(Resultado);
    } catch (error) {
        console.error('Error en ConsultarUbicacionEquipoController => ', error);
        return res.status(500).json({ error: `Error al consultar la ubicación del equipo => ${error}` });
    }
};
module.exports = {
    ConsultarUbicacionEquipoController
};
