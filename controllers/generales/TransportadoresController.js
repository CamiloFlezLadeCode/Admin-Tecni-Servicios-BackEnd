const { ListarTransportadoresService } = require('../../services/generales/TransportadoresService');

const ListarTransportadoresController = async (req, res) => {
    try {
        const Transportadores = await ListarTransportadoresService();
        console.log(`Transportadores obtenidos correctametne. Total: ${Transportadores.length}`);
        const TransportadoresMapeados = Transportadores.map(transportador => ({
            id: transportador.IdTransportador,
            value: transportador.DocumentoTransportador,
            label: transportador.NombreTransportador
        }));
        res.status(200).json(TransportadoresMapeados);
    } catch (error) {
        console.error('Error en ListarTransportadoresController => ', error);
        res.status(500).json({ error: `Error al consultar los transportadores => ${error}` });
    }
};
module.exports = {
    ListarTransportadoresController
};