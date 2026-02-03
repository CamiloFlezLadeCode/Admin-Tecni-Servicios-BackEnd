const path = require('path');
const { InfoPDFService } = require('../../../services/comercial/remisiones/InfoPDFService');
const PDFGeneratorService = require('../../../utils/GeneradorPDF');

// Configuración inicial
const pdfGenerator = new PDFGeneratorService({
  // templatesDir: path.join(__dirname, '../../../templates/Remision'),
  // imagesDir: path.join(__dirname, '../../../images'),
  // defaultTemplate: 'PlantillaRemision.Template.html',
  // defaultCSS: 'Style.css'
  templatesDir: path.join(__dirname, '../../../templates/General'),
  imagesDir: path.join(__dirname, '../../../images'),
  defaultTemplate: 'PlantillaClasicaActual.Template.html',
  defaultCSS: 'StyleClasica.css'
});

const GenerarPDFRemisionController = async (req, res) => {
  try {
    const { IdRemision } = req.params;
    const data = await InfoPDFService(IdRemision);

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Remisión no encontrada' });
    }

    const cabecera = data[0];
    const items = data.map(d => ({
      nombre: d.NombreEquipo,
      cantidad: d.Cantidad,
      observaciones: d.ObservacionesClienteItem || ''
    }));

    // Agregar transporte si aplica
    if (cabecera.IncluyeTransporte) {
      items.push({
        nombre: 'SERVICIO DE TRANSPORTE',
        cantidad: 1,
        // observaciones: `Valor: $${Number(cabecera.ValorTransporte).toLocaleString('es-CO')}`
      });
    }

    const HTML_MANUAL = `
            <table class="SinBordesDobles TableInfoItems BordesNegros1px">
      <thead>
        <tr>
          <th class="ColumnaCantidadItem BordesNegros1px">CANTIDAD</th>
          <th class="ColumnaNombreItem BordesNegros1px">EQUIPO</th>
          <th class="ColumnaObservacionItem BordesNegros1px">OBSERVACIONES</th>
        </tr>
      </thead>
      <tbody>
        {{rows}}
      </tbody>
    </table>

        <table class="TablaFirmas SinBordesDobles">
      <tr>
        <td class="CeldaContenedorFirma">
          <div class="ContenedorFirma">
            <span>{{Bodeguero}}</span>
          </div>
          <span>Bodeguero</span>
        </td>
        <td class="CeldaContenedorFirma">
          <div class="ContenedorFirma">
            <span>{{Despachador}}</span>
          </div>
          <span>Despachador</span>
        </td>
        <td class="CeldaContenedorFirma">
          <div class="ContenedorFirma">
            <span>{{Transportador}}</span>
          </div>
          <span>Transportador</span>
        </td>
      </tr>
      <tr>
        <td class="CeldaContenedorFirma">
          <div class="ContenedorFirma">
            <span>{{PlacaVehiculo}}</span>
          </div>
          <span>Vehículo</span>
        </td>
        <td class="CeldaContenedorFirma">
          <div class="ContenedorFirma">
            <span>{{PersonaQueRecibe}}</span>
          </div>
          <span>Recibe</span>
        </td>
        <td class="CeldaContenedorFirma">
          <div class="ContenedorFirma">
            <span>{{PlacaVehiculoRecibe}}</span>
          </div>
          <span>Placa</span>
        </td>
      </tr>
    </table>
        `;

    // Configurar reemplazos
    const replacements = {
      // INFO ENCABEZADO
      '{{LogoImagenBase64}}': pdfGenerator.loadImageAsBase64('LogoCompany.png'),
      '{{TituloDocumento}}': 'REMISIÓN',
      '{{CodigoDocumento}}': 'GTH-F-10',
      '{{VersionDocumento}}': '01',
      '{{VigenciaDocumento}}': 'Marzo 2025',
      // INFO EMPRESA PRINCIPAL
      '{{NombreEmpresa}}': 'TECNISERVICIOS J.F S.A.S',
      '{{MisionEmpresa}}': 'Reparación y alquiler de equipos para la construcción.',
      '{{NITEmpresa}}': '901893972-3',
      // TIPO Y NO CONSECUTIVO DOCUMENTO
      '{{TipoDocumento}}': 'Remisión',
      '{{NoDocumento}}': cabecera.NoRemision,
      // INFORMACIÓN DE CLIENTE
      '{{FechaDocumento}}': cabecera.FechaRemision,
      '{{Cliente}}': cabecera.Cliente,
      '{{DocumentoCliente}}': cabecera.DocumentoCliente,
      '{{DireccionProyecto}}': cabecera.DireccionProyecto,
      '{{Proyecto}}': cabecera.Proyecto,
      '{{Celular}}': [cabecera.Celular1, cabecera.Celular2].filter(Boolean).join(' / '),
      '{{Contacto}}': cabecera.Contacto ?? '',
      '{{{contenido}}}': HTML_MANUAL,
      '{{rows}}': pdfGenerator.generateTableRows(items, {
        columns: ['cantidad', 'nombre', 'observaciones']
      }),
      '{{Bodeguero}}': cabecera.Bodeguero,
      '{{Despachador}}': cabecera.Despachador,
      '{{Transportador}}': cabecera.Transportador,
      '{{PersonaQueRecibe}}': cabecera.PersonaQueRecibe,
      '{{PlacaVehiculo}}': cabecera.PlacaVehiculo,
      '{{PlacaVehiculoRecibe}}': cabecera.PlacaVehiculoRecibe,
      // INFO_FOOTER
      '{{Telefono1}}': '3016184573',
      '{{Telefono2}}': '3228376688',
      '{{DireccionEmpresa}}': 'CRA 36 # 42-42 EL SALVADOR',
      '{{EmailEmpresa}}': 'tecniserviciossas2024@gmail.com',
      '{{IconoWhatsApp}}': pdfGenerator.loadImageAsBase64('icono-whatsapp.svg', 'image/svg+xml'),
      '{{IconoDireccion}}': pdfGenerator.loadImageAsBase64('icono-direccion.svg', 'image/svg+xml'),
      '{{IconoEmail}}': pdfGenerator.loadImageAsBase64('icono-email.png'),
    };

    // Generar PDF
    const pdfBuffer = await pdfGenerator.generatePDF({
      replacements,
      pdfOptions: {
        format: 'letter',
        margin: { top: '0px', bottom: '12px', left: '10px', right: '10px' }
      }
    });

    // Enviar respuesta
    pdfGenerator.sendPDFResponse(res, pdfBuffer, `remision-${cabecera.NoRemision}.pdf`, true);

  } catch (error) {
    console.error('Error al generar PDF:', error);
    res.status(500).json({ error: 'Error generando PDF' });
  } finally {
    await pdfGenerator.close();
  }
};

module.exports = {
  GenerarPDFRemisionController
};