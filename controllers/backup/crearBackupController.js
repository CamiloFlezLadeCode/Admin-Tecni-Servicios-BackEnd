const path = require('path');
const mysqldump = require('mysqldump');
const fs = require('fs');

const crearBackup = async (req, res) => {
  try {
    const backupsDir = path.join(__dirname, '../../', 'backups_bd');

    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir);
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours; // la hora 0 debe ser 12
    const formattedHours = String(hours).padStart(2, '0');

    const timestamp = `${year}${month}${day} ${formattedHours}${minutes}${ampm}`;
    const filename = `backup-${timestamp}.sql`;
    const filePath = path.join(backupsDir, filename);

    await mysqldump({
      connection: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'tecniservicios',
      },
      dumpToFile: filePath,
    });

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
