const now = new Date();
const timeZone = 'America/Bogota';

const options = {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
};

// Devuelve string como "03/05/2025, 15:47:22"
const formatted = new Intl.DateTimeFormat('es-CO', options).format(now);

// Convertir a formato SQL: yyyy-MM-dd HH:mm:ss
const [datePart, timePart] = formatted.split(', ');
const [day, month, year] = datePart.split('/');
const FechaCreacion = `${year}-${month}-${day} ${timePart}`;

console.log(FechaCreacion); // Ej: 2025-05-03 15:47:22
