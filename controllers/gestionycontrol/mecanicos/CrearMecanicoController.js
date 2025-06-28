const { CrearMecanicoService } = require('../../../services/gestionycontrol/mecanicos/CrearMecanicoService');

const CrearMecanicoController = async (req, res) => {
    try {
        const mecanicoData = req.body;
        if (!mecanicoData.UsuarioCreacion) {
            return res.status(400).json({ error: 'UsuarioCreacion es requerido' });
        };
        const resultado = await CrearMecanicoService(mecanicoData);
        console.log("Mecánico creado correctamente");
        return res.status(200).json({ message: 'Mecnánico creado correctamente', data: resultado });
    } catch (error) {
        console.error('Error en CrearMecanicoController => ', error);
        return res.status(500).json({ error: `Error al crear mecánico => ${error}` });
    }
};
module.exports = {
    CrearMecanicoController
};