const { MostrarSubarrendatariosConRemisionAsignadaService } = require('../../../services/comercial/devoluciones/MostrarSubarrendatariosConRemisionAsignadaService');

const MostrarSubarrendatariosConRemisionAsignadaController = async (req, res) => {
    try {
        const DatosConsulta = req.query;
        const Subarrendatarios = await MostrarSubarrendatariosConRemisionAsignadaService(DatosConsulta);
        console.log(`SUBARRENDATARIOS CON REMISIONES ASIGNADAS, CONSULTADOS CORRECTAMENTE. TOTAL: ${Subarrendatarios.length}`);
        const SubarrendatariosMapeados = Subarrendatarios.map(subarrendatario => ({
            value: subarrendatario.DocumentoSubarrendatario,
            label: subarrendatario.Subarrendatario
        }));
        return res.status(200).json(SubarrendatariosMapeados);
    } catch (error) {
        console.error('Error en MostrarSubarrendatariosConRemisionAsignadaController => ', error.message);
        return res.status(500).json({ error: `Error al consultar los subarrendatarios con remisiones asigandas => ${error.message}` });
    }
};
module.exports = {
    MostrarSubarrendatariosConRemisionAsignadaController
};