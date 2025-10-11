const { VerEquiposClienteService } = require('../../../services/comercial/ordenes_de_servicio/VerEquiposClienteService');

const VerEquiposClienteController = async (req, res) => {
    try {
        const ParametrosConsultaEquiposCliente = req.query;
        if (!ParametrosConsultaEquiposCliente.IdTipoBodega || !ParametrosConsultaEquiposCliente.DocumentoPropietario) {
            return res.status(400).json({ data: null, message: 'No se especificaron los parametros de consulta' });
        }
        const EquiposDelCliente = await VerEquiposClienteService(ParametrosConsultaEquiposCliente) || [];
        console.log(`EQUIPOS DEL CLIENTE OBTENIDOS CORRECTAMENTE. TOTAL: ${EquiposDelCliente.length}`);
        const EquiposDelClienteMapeados = EquiposDelCliente.map(equipo => ({
            value: equipo.IdEquipo,
            label: equipo.NombreEquipo
        }));
        return res.status(200).json(EquiposDelClienteMapeados);
    } catch (error) {
        console.error('Error en VerEquiposClienteController => ', error.message);
        return res.status(500).json({ error: `Error al obtener los equipos del cliente=> ${error.message}` });
    }
};
module.exports = {
    VerEquiposClienteController
};