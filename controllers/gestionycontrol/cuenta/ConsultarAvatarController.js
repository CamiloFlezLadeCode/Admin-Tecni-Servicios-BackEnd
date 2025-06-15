// const path = require('path');
// const fs = require('fs');

// const ConsultarAvatarController = async (req, res) => {
//     try {
//         const DocumentoUsuarioActivo = req.params.DocumentoUsuarioActivo;
//         const RutaArchivo = path.join(__dirname, '../../../uploads/avatar', DocumentoUsuarioActivo);

//         // Validar si el archivo existe
//         if (!fs.existsSync(RutaArchivo)) {
//             return res.status(404).json({ error: 'Avatar no encontrado' });
//         }
//         // ...

//         return res.sendFile(RutaArchivo);
//     } catch (error) {
//         console.error(`Ocurrió un error en ConsultarAvatarController: ${error}`);
//     }
// };

// module.exports = {
//     ConsultarAvatarController
// };


// const path = require('path');
// const fs = require('fs');

// const ConsultarAvatarController = async (req, res) => {
//     try {
//         const documento = req.params.DocumentoUsuarioActivo;
//         const avatarDir = path.join(__dirname, '../../../uploads/avatar');

//         // Extensiones posibles
//         const extensiones = ['.png', '.jpg', '.jpeg'];

//         // Buscar archivo con alguna de las extensiones permitidas
//         const archivoEncontrado = extensiones.find(ext => 
//             fs.existsSync(path.join(avatarDir, `${documento}${ext}`))
//         );

//         if (!archivoEncontrado) {
//             return res.status(404).json({ error: 'Avatar no encontrado' });
//         }

//         const rutaFinal = path.join(avatarDir, `${documento}${archivoEncontrado}`);
//         return res.sendFile(rutaFinal);
//     } catch (error) {
//         console.error(`❌ Error en ConsultarAvatarController:`, error);
//         return res.status(500).json({ error: 'Error interno al buscar el avatar' });
//     }
// };

// module.exports = {
//     ConsultarAvatarController
// };





// // 777
// const path = require('path');
// const fs = require('fs');

// const ConsultarAvatarController = async (req, res) => {
//   try {
//     const documento = req.params.DocumentoUsuarioActivo;
//     const avatarDir = path.resolve(__dirname, '../../../uploads/avatar');

//     // Extensiones válidas
//     const extensiones = ['.png', '.jpg', '.jpeg'];

//     // Buscar si existe un archivo con alguna extensión válida
//     let rutaArchivo = null;

//     for (const ext of extensiones) {
//       const posibleRuta = path.join(avatarDir, `${documento}${ext}`);
//       if (fs.existsSync(posibleRuta)) {
//         rutaArchivo = posibleRuta;
//         break;
//       }
//     }

//     if (!rutaArchivo) {
//       return res.status(404).json({ error: 'Avatar no encontrado' });
//     }

//     return res.sendFile(rutaArchivo);
//   } catch (error) {
//     console.error(`❌ Error en ConsultarAvatarController:`, error);
//     return res.status(500).json({ error: 'Error interno al buscar el avatar' });
//   }
// };

// module.exports = {
//   ConsultarAvatarController,
// };





// // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// const path = require('path');
// const fs = require('fs');

// const ConsultarAvatarController = async (req, res) => {
//   try {
//     const documento = req.params.DocumentoUsuarioActivo;
//     const avatarDir = path.resolve(__dirname, '../../../uploads/avatar');

//     const extensiones = ['.png', '.jpg', '.jpeg'];
//     let rutaArchivo = null;

//     for (const ext of extensiones) {
//       const posibleRuta = path.join(avatarDir, `${documento}${ext}`);
//       if (fs.existsSync(posibleRuta)) {
//         rutaArchivo = posibleRuta;
//         break;
//       }
//     }

//     if (!rutaArchivo) {
//       return res.status(404).json({ error: 'Avatar no encontrado' });
//     }

//     // 👇 Cabeceras esenciales para que el navegador no bloquee la imagen
//     res.setHeader('Access-Control-Allow-Origin', process.env.DOMINIO_FRONTEND || '*');
//     res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

//     return res.sendFile(rutaArchivo);
//   } catch (error) {
//     console.error(`❌ Error en ConsultarAvatarController:`, error);
//     return res.status(500).json({ error: 'Error interno al buscar el avatar' });
//   }
// };

// module.exports = {
//   ConsultarAvatarController,
// };




const path = require('path');
const fs = require('fs');

const ConsultarAvatarController = async (req, res) => {
    try {
        const documento = req.params.DocumentoUsuarioActivo;
        const avatarDir = path.resolve(__dirname, '../../../uploads/avatar');

        // Leer todos los archivos del directorio
        const archivos = fs.readdirSync(avatarDir);

        // Filtrar archivos que empiecen con el documento y tengan extensión válida
        const extensiones = ['.png', '.jpg', '.jpeg'];
        const archivosUsuario = archivos
            .filter(f => {
                const base = path.basename(f, path.extname(f));
                const ext = path.extname(f).toLowerCase();
                return base === documento && extensiones.includes(ext);
            })
            .map(f => ({
                name: f,
                time: fs.statSync(path.join(avatarDir, f)).mtime.getTime(),
            }));

        if (archivosUsuario.length === 0) {
            return res.status(404).json({ error: 'Avatar no encontrado' });
        }

        // Ordenar por fecha descendente y tomar el más reciente
        archivosUsuario.sort((a, b) => b.time - a.time);
        const ultimoArchivo = archivosUsuario[0].name;
        const rutaFinal = path.join(avatarDir, ultimoArchivo);

        // Cabeceras CORS / CORP
        res.setHeader('Access-Control-Allow-Origin', process.env.DOMINIO_FRONTEND || '*');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

        // Enviar el archivo más reciente
        return res.sendFile(rutaFinal);
    } catch (error) {
        console.error(`❌ Error en ConsultarAvatarController:`, error);
        return res.status(500).json({ error: 'Error interno al buscar el avatar' });
    }
};

module.exports = {
    ConsultarAvatarController,
};
