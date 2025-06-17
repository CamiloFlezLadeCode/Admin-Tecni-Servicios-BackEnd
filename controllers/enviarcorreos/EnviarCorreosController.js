const path = require('path');
const { enviarRemision } = require('../../services/enviarcorreos/EnviarCorreos.Service');

const enviarRemisionController = async (req, res) => {
  try {
    const { destinatario, asunto, html } = req.body;

    // Ruta absoluta o relativa donde se encuentra el PDF a adjuntar
    const rutaPDF = path.join(__dirname, '../remisiones/ultima-remision.pdf');

    await enviarRemision({ destinatario, asunto, html, rutaPDF });

    res.status(200).json({
      ok: true,
      message: 'Remisión enviada correctamente'
    });
  } catch (error) {
    console.error('❌ Error al enviar remisión:', error);
    res.status(500).json({
      ok: false,
      error: 'No se pudo enviar la remisión'
    });
  }
};

module.exports = { enviarRemisionController };
