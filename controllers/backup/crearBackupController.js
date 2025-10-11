require('dotenv').config();
const path = require('path');
const mysqldump = require('mysqldump');
const fs = require('fs');
const { FechaActualColombia } = require('../../utils/FechaActualColombia');

const crearBackup = async (req, res) => {
  try {
    const backupsDir = path.join(__dirname, '../../', 'backups_bd');
    const fechaColombia = FechaActualColombia();

    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir);
    }

    // Convertir "2025-05-18 03:46:50" -> "20250518 034650AM"
    const [fecha, hora] = fechaColombia.split(' ');
    const [year, month, day] = fecha.split('-');
    let [hh, mm, ss] = hora.split(':');


    let ampm = 'AM';
    let h = parseInt(hh, 10);
    if (h >= 12) {
      ampm = 'PM';
      if (h > 12) h -= 12;
    }
    if (h === 0) h = 12;

    const hourFormatted = String(h).padStart(2, '0');
    const timestamp = `${year}${month}${day}_${hourFormatted}${mm}${ss}${ampm}`;

    const filename = `tecniservicios_backup_${timestamp}.sql`;
    const filePath = path.join(backupsDir, filename);

    // Entorno: 'Produccion' o 'Desarrollo'
    const ENTORNO = process.env.VARIABLE_ENV_ENTORNO;
    const ConfiguracionSegunEntorno = {
      // Sin Docker
      // Desarrollo: {
      //     host: 'localhost',
      //     user: 'root',
      //     password: null,
      //     database: 'tecniservicios',
      //     port: 3306,
      //     connectionLimit: 10, // tráfico local
      // },
      // Con Docker
      Desarrollo: {
        host: 'localhost',
        user: 'devuser',
        password: 'devpass',
        database: 'tecniservicios',
        port: 3306,
        connectionLimit: 10, // tráfico local
      },
      Produccion: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306,
      }
    };
    const dbConfig = ConfiguracionSegunEntorno[ENTORNO];

    await mysqldump({
      connection: {
        ...dbConfig
      },
      dumpToFile: filePath,
    })
    console.log('✅ Backup generado:', filePath);

    res.status(200).json({
      ok: true,
      message: 'Backup realizado correctamente',
      filename,
      path: `/api/backups/${filename}`,
    });
  } catch (error) {
    console.error('Error en crearBackup:', error);
    res.status(500).json({ error: 'Error al crear el backup de la bd' });
  }
};

module.exports = {
  crearBackup,
};



// CON CUENTA DE GOOGLE WORKSPACE, EMPRESAS
// require('dotenv').config();
// const path = require('path');
// const mysqldump = require('mysqldump');
// const fs = require('fs');
// const { google } = require('googleapis');
// const { FechaActualColombia } = require('../../utils/FechaActualColombia');

// // Función para subir a Google Drive
// const subirArchivoAGoogleDrive = async (nombreArchivo, rutaArchivo) => {
//   const auth = new google.auth.GoogleAuth({
//     keyFile: path.join(__dirname, '../../', 'credenciales/drive-service-account.json'), // ← ruta a tu archivo JSON
//     // scopes: ['https://www.googleapis.com/auth/drive.file'],
//     scopes: ['https://www.googleapis.com/auth/drive']
//   });

//   const drive = google.drive({ version: 'v3', auth });

//   const response = await drive.files.create({
//     requestBody: {
//       name: nombreArchivo,
//       parents: [process.env.GDRIVE_FOLDER_ID], // ← ID de carpeta compartida
//     },
//     media: {
//       mimeType: 'application/sql',
//       body: fs.createReadStream(rutaArchivo),
//     },
//   });

//   return response.data;
// };

// const crearBackup = async (req, res) => {
//   try {
//     const backupsDir = path.join(__dirname, '../../', 'backups_bd');
//     const fechaColombia = FechaActualColombia();

//     if (!fs.existsSync(backupsDir)) {
//       fs.mkdirSync(backupsDir);
//     }

//     const [fecha, hora] = fechaColombia.split(' ');
//     const [year, month, day] = fecha.split('-');
//     let [hh, mm, ss] = hora.split(':');

//     let ampm = 'AM';
//     let h = parseInt(hh, 10);
//     if (h >= 12) {
//       ampm = 'PM';
//       if (h > 12) h -= 12;
//     }
//     if (h === 0) h = 12;

//     const hourFormatted = String(h).padStart(2, '0');
//     const timestamp = `${year}${month}${day}_${hourFormatted}${mm}${ss}${ampm}`;

//     const filename = `tecniservicios_backup_${timestamp}.sql`;
//     const filePath = path.join(backupsDir, filename);

//     const ENTORNO = process.env.VARIABLE_ENV_ENTORNO;
//     const ConfiguracionSegunEntorno = {
//       Desarrollo: {
//         host: 'localhost',
//         user: 'root',
//         password: '',
//         database: 'tecniservicios',
//         port: 3306,
//       },
//       Produccion: {
//         host: process.env.DB_HOST,
//         user: process.env.DB_USER,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DB_NAME,
//         port: process.env.DB_PORT || 3306,
//       }
//     };

//     const dbConfig = ConfiguracionSegunEntorno[ENTORNO];

//     await mysqldump({
//       connection: { ...dbConfig },
//       dumpToFile: filePath,
//     });

//     console.log('✅ Backup generado:', filePath);

//     const driveResponse = await subirArchivoAGoogleDrive(filename, filePath);

//     res.status(200).json({
//       ok: true,
//       message: 'Backup realizado y subido correctamente',
//       filename,
//       driveFileId: driveResponse.id,
//     });
//   } catch (error) {
//     console.error('❌ Error en crearBackup:', error);
//     res.status(500).json({ error: 'Error al crear el backup de la bd' });
//   }
// };

// module.exports = {
//   crearBackup,
// };


// // CON CUENTA DE GOOGLE NORMAL/PERSONAL
// require('dotenv').config();
// const path = require('path');
// const mysqldump = require('mysqldump');
// const fs = require('fs');
// const { google } = require('googleapis');
// const { FechaActualColombia } = require('../../utils/FechaActualColombia');

// // Ruta a credenciales y token
// const CREDENTIALS_PATH = path.join(__dirname, '../../credenciales/client_secret.json');
// const TOKEN_PATH = path.join(__dirname, '../../credenciales/token.json');

// // Función para autenticar con OAuth
// async function getOAuth2Client() {
//   const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
//   const { client_secret, client_id, redirect_uris } = credentials.web;

//   const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

//   if (fs.existsSync(TOKEN_PATH)) {
//     const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
//     oAuth2Client.setCredentials(token);
//     return oAuth2Client;
//   }

//   // Si no hay token, generar URL de autorización
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: ['https://www.googleapis.com/auth/drive.file'],
//   });

//   console.log('🔗 Autoriza esta app visitando esta URL:', authUrl);

//   const readline = require('readline').createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });

//   const code = await new Promise((resolve) => {
//     readline.question('🔑 Ingresa el código de autorización: ', resolve);
//   });

//   readline.close();

//   const { tokens } = await oAuth2Client.getToken(code);
//   oAuth2Client.setCredentials(tokens);
//   fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
//   console.log('✅ Token guardado en token.json');

//   return oAuth2Client;
// }

// // Función para subir archivo con OAuth2
// const subirArchivoAGoogleDrive = async (nombreArchivo, rutaArchivo) => {
//   const auth = await getOAuth2Client();
//   const drive = google.drive({ version: 'v3', auth });

//   const response = await drive.files.create({
//     requestBody: {
//       name: nombreArchivo,
//       mimeType: 'application/sql',
//     },
//     media: {
//       mimeType: 'application/sql',
//       body: fs.createReadStream(rutaArchivo),
//     },
//   });

//   return response.data;
// };

// const crearBackup = async (req, res) => {
//   try {
//     const backupsDir = path.join(__dirname, '../../', 'backups_bd');
//     const fechaColombia = FechaActualColombia();

//     if (!fs.existsSync(backupsDir)) {
//       fs.mkdirSync(backupsDir);
//     }

//     const [fecha, hora] = fechaColombia.split(' ');
//     const [year, month, day] = fecha.split('-');
//     let [hh, mm, ss] = hora.split(':');

//     let ampm = 'AM';
//     let h = parseInt(hh, 10);
//     if (h >= 12) {
//       ampm = 'PM';
//       if (h > 12) h -= 12;
//     }
//     if (h === 0) h = 12;

//     const hourFormatted = String(h).padStart(2, '0');
//     const timestamp = `${year}${month}${day}_${hourFormatted}${mm}${ss}${ampm}`;

//     const filename = `tecniservicios_backup_${timestamp}.sql`;
//     const filePath = path.join(backupsDir, filename);

//     const ENTORNO = process.env.VARIABLE_ENV_ENTORNO;
//     const ConfiguracionSegunEntorno = {
//       Desarrollo: {
//         host: 'localhost',
//         user: 'root',
//         password: '',
//         database: 'tecniservicios',
//         port: 3306,
//       },
//       Produccion: {
//         host: process.env.DB_HOST,
//         user: process.env.DB_USER,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DB_NAME,
//         port: process.env.DB_PORT || 3306,
//       }
//     };

//     const dbConfig = ConfiguracionSegunEntorno[ENTORNO];

//     await mysqldump({
//       connection: { ...dbConfig },
//       dumpToFile: filePath,
//     });

//     console.log('✅ Backup generado:', filePath);

//     const driveResponse = await subirArchivoAGoogleDrive(filename, filePath);

//     res.status(200).json({
//       ok: true,
//       message: 'Backup realizado y subido correctamente',
//       filename,
//       driveFileId: driveResponse.id,
//     });
//   } catch (error) {
//     console.error('❌ Error en crearBackup:', error);
//     res.status(500).json({ error: 'Error al crear el backup de la bd' });
//   }
// };

// module.exports = {
//   crearBackup,
// };
