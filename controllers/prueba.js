const { query } = require('../config/db.js'); // Ajusta la ruta según tu estructura

async function ObtenerDepartamentos(req, res) {
    try {
        const departamentos = await query(`
        SELECT	
	CONCAT("{ value: '", IdPais, "', label: '", Nombre, "' },") AS 'Paises',
    IdPais, Nombre
FROM
	pais;  
    
    
            #SELECT	
            #*
        #FROM
           # usuarios;    
        
        `);
        // console.log("DEPARTAMENTOS OBTENIDOS CORRECTAMENTE");
        // console.log(departamentos);
        // res.json(departamentos);

        // Formatear la respuesta como un array de objetos
        const response = departamentos.map(departamento => ({
            value: departamento.IdPais,
            label: departamento.Nombre
        }));

        console.log("DEPARTAMENTOS OBTENIDOS CORRECTAMENTE");
        // console.log(response);
        res.json(departamentos);
    } catch (error) {
        console.error('Error al obtener departamentos:', error);
        res.status(500).json({ error: 'Error al obtener departamentos' }); // Enviar error
    }
}

// Exportar función
module.exports = {
    ObtenerDepartamentos,
};