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
    const ENTORNO = process.env.NODE_ENV || 'Desarrollo';
    const ConfiguracionSegunEntorno = {
      Desarrollo: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'tecniservicios',
        port: process.env.DB_PORT || 3306,
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

    // await mysqldump({
    //   connection: {
    //     host: 'localhost',
    //     user: 'root',
    //     password: '',
    //     database: 'tecniservicios',
    //   },
    //   dumpToFile: filePath,
    // });

    await mysqldump({
      connection: {
        ...dbConfig
      },
      dumpToFile: filePath,
    })


    // const now = new Date();
    // const year = now.getFullYear();
    // const month = String(now.getMonth() + 1).padStart(2, '0');
    // const day = String(now.getDate()).padStart(2, '0');
    // const second = String(now.)

    // let hours = now.getHours();
    // const minutes = String(now.getMinutes()).padStart(2, '0');
    // const ampm = hours >= 12 ? 'PM' : 'AM';
    // hours = hours % 12;
    // hours = hours === 0 ? 12 : hours; // la hora 0 debe ser 12
    // const formattedHours = String(hours).padStart(2, '0');

    // const timestamp = `${year}${month}${day} ${formattedHours}${minutes}${ampm}`;
    // const filename = `tecniservicios backup-${timestamp}.sql`;
    // const filePath = path.join(backupsDir, filename);

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
