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
function FechaActualColombia() {
    const now = new Date();
    const formatted = new Intl.DateTimeFormat('es-CO', options).format(now);
    const [datePart, timePart] = formatted.split(', ');
    const [day, month, year] = datePart.split('/');
    return `${year}-${month}-${day} ${timePart}`;
}
module.exports = {
    FechaActualColombia
};