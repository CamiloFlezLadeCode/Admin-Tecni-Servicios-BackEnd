// 'playwright'
// 'pdfmake'

// // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// const fs = require('fs');
// const path = require('path');
// const { chromium } = require('playwright'); // ES compatible con require


// // const fs = require('fs');
// // const path = require('path');
// const PdfPrinter = require('pdfmake');
// const { InfoPDFService } = require('../../../services/comercial/remisiones/InfoPDFService');
// const { PlantillaPDFRemision } = require('../../../templates/Remision/PlantillaPDFRemision.Template');
// const { FechaActualColombia } = require('../../../utils/FechaActualColombia');

// const Herramienta = 'playwright';
// // const Herramienta = 'pdfmake';


// const GenerarPDFRemisionController = async (req, res) => {
//     if (Herramienta === 'playwright') {
//         const LogoImagenBase64 = `data:image/png;base64,${fs.readFileSync(path.resolve(__dirname, '../../../image/LogoCompany.png')).toString('base64')}`;
//         const IconoWhatsApp = `data:image/svg+xml;base64,${fs.readFileSync(path.resolve(__dirname, '../../../image/icono-whatsapp.svg')).toString('base64')}`;
//         const IconoDireccion = `data:image/svg+xml;base64,${fs.readFileSync(path.resolve(__dirname, '../../../image/icono-direccion.svg')).toString('base64')}`;
//         const IconoEmail = `data:image/png;base64,${fs.readFileSync(path.resolve(__dirname, '../../../image/icono-email.png')).toString('base64')}`;
//         try {
//             const { IdRemision } = req.params;
//             const data = await InfoPDFService(IdRemision);

//             if (!data || data.length === 0) {
//                 return res.status(404).json({ error: 'Remisión no encontrada' });
//             }

//             const cabecera = data[0];
//             const items = data.map(d => ({
//                 nombre: d.NombreEquipo,
//                 cantidad: d.Cantidad,
//                 observaciones: d.ObservacionesClienteItem || ''
//             }));

//             // return res.status(200).json(
//             //     data
//             // )

//             // Carga la plantilla HTML
//             const templatePath = path.join(__dirname, '../../../templates/Remision/PlantillaRemision.Template.html');
//             let html = fs.readFileSync(templatePath, 'utf8');

//             // Genera las filas de la tabla
//             const rows = items.map(item => `
//                 <tr class="SinBordesDobles">
//                     <td class="BordesNegros1px SinBordesDobles">${item.cantidad}</td>    
//                     <td class="BordesNegros1px SinBordesDobles">${item.nombre}</td>
//                     <td class="BordesNegros1px SinBordesDobles">${item.observaciones}</td>
//                 </tr>
//             `).join('');

//             // // Se lee archivo css con estilos 
//             const css = fs.readFileSync(path.join(__dirname, '../../../templates/Remision/Style.css'), 'utf8');

//             // // Reemplaza los valores en el template
//             // html = html
//             //     .replace('</head>', `<style>${css}</style></head>`)
//             //     .replace('{{LogoImagenBase64}}', LogoImagenBase64)
//             //     // .replace('{{NoRemision}}', cabecera.NoRemision)
//             //     .replace(/{{NoRemision}}/g, cabecera.NoRemision)
//             //     .replace('{{Cliente}}', cabecera.Cliente)
//             //     .replace('{{Proyecto}}', cabecera.Proyecto)
//             //     .replace('{{rows}}', rows)
//             //     .replace('{{IconoWhatsApp}}', IconoWhatsApp)
//             //     .replace('{{IconoDireccion}}', IconoDireccion)
//             //     .replace('{{IconoEmail}}', IconoEmail)
//             //     .replace('{{FechaRemision}}', cabecera.FechaCreacion)
//             //     .replace('{{Cliente}}', cabecera.Cliente)
//             //     .replace('{{DocumentoCliente}}', cabecera.DocumentoCliente)
//             //     .replace('{{DireccionProyecto}}', cabecera.DireccionProyecto)
//             //     .replace('{{Proyecto}}', cabecera.Proyecto)
//             //     .replace('{{Celular}}', cabecera.Celular)
//             //     ;

//             const reemplazos = {
//                 '{{LogoImagenBase64}}': LogoImagenBase64,
//                 '{{NoRemision}}': cabecera.NoRemision,
//                 '{{Cliente}}': cabecera.Cliente,
//                 '{{Proyecto}}': cabecera.Proyecto,
//                 '{{rows}}': rows,
//                 '{{IconoWhatsApp}}': IconoWhatsApp,
//                 '{{IconoDireccion}}': IconoDireccion,
//                 '{{IconoEmail}}': IconoEmail,
//                 '{{FechaRemision}}': cabecera.FechaCreacion,
//                 '{{DocumentoCliente}}': cabecera.DocumentoCliente,
//                 '{{DireccionProyecto}}': cabecera.DireccionProyecto,
//                 '{{Celular}}': cabecera.Celular ?? '',
//                 '{{Contacto}}': cabecera.Contacto ?? '',
//                 '{{Bodeguero}}': cabecera.Bodeguero,
//                 '{{Despachador}}': cabecera.Despachador,
//                 '{{Transportador}}': cabecera.Transportador,
//                 '{{PersonaQueRecibe}}': cabecera.PersonaQueRecibe,
//                 '{{PlacaVehiculo}}': cabecera.PlacaVehiculo,
//                 '{{PlacaVehiculoRecibe}}': cabecera.PlacaVehiculoRecibe
//             };

//             // Reemplazo múltiple usando regex global
//             for (const [clave, valor] of Object.entries(reemplazos)) {
//                 html = html.replace(new RegExp(clave, 'g'), valor);
//             }

//             // Inserta los estilos CSS antes del cierre de </head>
//             html = html.replace('</head>', `<style>${css}</style></head>`);


//             // Usa Playwright para renderizar y generar el PDF
//             const browser = await chromium.launch();
//             const page = await browser.newPage();

//             await page.setContent(html, { waitUntil: 'domcontentloaded' });

//             // const pdfBuffer = await page.pdf({
//             //     format: 'A4',
//             //     printBackground: true,
//             //     margin: { top: '0px', bottom: '4px', left: '10px', right: '10px' }
//             // });

//             //Otra forma con A4 es incrementar el maring-bottom 
//             // const pdfBuffer = await page.pdf({
//             //     format: 'A4',  // o 'letter' si es requerido
//             //     printBackground: true,
//             //     margin: { top: '0px', bottom: '20px', left: '10px', right: '10px' }
//             // });

//             //Formato con medidas manuales
//             // const pdfBuffer = await page.pdf({
//             //     width: '8.5in',    // Ancho carta (EEUU) = 8.5 pulgadas
//             //     height: '11in',    // Alto carta = 11 pulgadas
//             //     printBackground: true,
//             //     margin: { top: '0px', bottom: '4px', left: '10px', right: '10px' }
//             // });

//             //Formato letter estandar de playwright
//             const pdfBuffer = await page.pdf({
//                 format: 'letter',  // Formato carta estándar (EEUU/Canadá/México)
//                 printBackground: true,
//                 margin: { top: '0px', bottom: '12px', left: '10px', right: '10px' }
//             });

//             await browser.close();

//             res.setHeader('Content-Type', 'application/pdf');
//             res.setHeader('Content-Disposition', `inline; filename=remision-${cabecera.NoRemision}.pdf`);
//             res.end(pdfBuffer);

//         } catch (error) {
//             console.error('Error al generar PDF con Playwright:', error);
//             res.status(500).json({ error: 'Error generando PDF' });
//         }
//     } else if (Herramienta === 'pdfmake') {
//         const RutaLogo = path.join(__dirname, '../../../image/LogoCompany.png');
//         const LogoBase64 = fs.readFileSync(RutaLogo).toString('base64');
//         const LogoImageBase64 = `data:image/png;base64,${LogoBase64}`;

//         const fonts = {
//             Roboto: {
//                 normal: path.join(__dirname, '../../../fonts/Roboto/static/Roboto-Regular.ttf'),
//                 bold: path.join(__dirname, '../../../fonts/Roboto/static/Roboto-Bold.ttf'),
//                 italics: path.join(__dirname, '../../../fonts/Roboto/static/Roboto-Italic.ttf'),
//                 bolditalics: path.join(__dirname, '../../../fonts/Roboto/static/Roboto-BoldItalic.ttf'),
//             }
//         };

//         const printer = new PdfPrinter(fonts);

//         try {
//             const { IdRemision } = req.params;
//             const data = await InfoPDFService(IdRemision);

//             if (!data || data.length === 0) {
//                 return res.status(404).json({ error: 'Remisión no encontrada' });
//             }

//             const cabecera = data[0];
//             const items = data.map(d => [d.NombreEquipo, d.Cantidad.toString(), d.ObservacionesClienteItem || '']);

//             const docDefinition = PlantillaPDFRemision(cabecera, items, LogoImageBase64, FechaActualColombia());

//             const pdfDoc = printer.createPdfKitDocument(docDefinition);
//             const chunks = [];

//             pdfDoc.on('data', chunk => chunks.push(chunk));
//             pdfDoc.on('end', () => {
//                 const result = Buffer.concat(chunks);
//                 res.setHeader('Content-Type', 'application/pdf');
//                 // res.setHeader('Content-Disposition', `attachment; filename=remision-${cabecera.NoRemision}.pdf`); // El attachment fuerza la descarga automáticamente
//                 res.setHeader('Content-Disposition', `filename=remision-${cabecera.NoRemision}.pdf`);
//                 // res.setHeader('Content-Disposition', 'inline', `filename=RemisionNo${cabecera.NoRemision}`); // o 'attachment' para forzar descarga
//                 res.end(result);
//             });

//             pdfDoc.end();

//         } catch (error) {
//             console.error('Error generando PDF:', error);
//             return res.status(500).json({ error: 'Error generando PDF' });
//         }
//     } else {
//         return res.status(500).json({ error: 'Herramienta desconocida para generar PDF' });
//     }
// }

// module.exports = {
//     GenerarPDFRemisionController
// }

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
            '{{CodigoDocumento}}': 'GTH-F-8',
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
            '{{FechaDocumento}}': cabecera.FechaCreacion,
            '{{Cliente}}': cabecera.Cliente,
            '{{DocumentoCliente}}': cabecera.DocumentoCliente,
            '{{DireccionProyecto}}': cabecera.DireccionProyecto,
            '{{Proyecto}}': cabecera.Proyecto,
            '{{Celular}}': cabecera.Celular ?? '',
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