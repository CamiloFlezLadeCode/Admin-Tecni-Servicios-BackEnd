const { ListarMecanicosService } = require('../../services/generales/MecanicosService');

const ListarMecanicosController = async (req, res) => {
    try {
        const Mecanicos = await ListarMecanicosService();
        console.log(`Mecánicos obtenidos correctamente. Total: ${Mecanicos.length}`);
        const MecanicosMapeados = Mecanicos.map(mecanico => ({
            Id: mecanico.IdMecanico,
            value: mecanico.DocumentoMecanico,
            label: mecanico.NombreMecanico
        }));
        return res.status(200).json(MecanicosMapeados);
    } catch (error) {
        console.error('Error en ListarMecanicosController => ', error.message);
        return res.status(500).json({ error: `Error al listar los mecánicos => ${error.message}` });
    }
};
module.exports = {
    ListarMecanicosController
};