// const { InfoPDFService } = require('../../../services/comercial/remisiones/InfoPDFService');

// const GenerarPDFController = async (req, res) => {
//     try {
//         const { IdRemision } = req.params;
//         const Remision = await InfoPDFService(IdRemision);
//         console.log(`Remisión con id: ${IdRemision} obtenida correctamente`);
//         return res.status(200).json(
//             Remision
//         );
//     } catch (error) {
//         console.error('Error en GenerarPDFController => ', error);
//         res.status(500).json({ error: `Error al generar el PDF de la remisón con id: ${IdRemision} => ${error}` });
//     }
// };
// module.exports = {
//     GenerarPDFController
// };


// // 777774$$$$$$$
// const { InfoPDFService } = require('../../../services/comercial/remisiones/InfoPDFService');

// const GenerarPDFController = async (req, res) => {
//     try {
//         const { IdRemision } = req.params;
//         const resultado = await InfoPDFService(IdRemision);

//         if (!resultado || resultado.length === 0) {
//             return res.status(404).json({ error: 'No se encontró información para esta remisión.' });
//         }

//         // Tomamos los datos generales del primer ítem (ya que son repetidos)
//         const datosGenerales = {
//             Cliente: resultado[0].Cliente?.trim(),
//             Proyecto: resultado[0].Proyecto?.trim(),
//             DireccionProyecto: resultado[0].DireccionProyecto?.trim(),
//             Correo: resultado[0].Correo,
//             Celular: resultado[0].Celular,
//             Telefono: resultado[0].Telefono,
//             DireccionCliente: resultado[0].DireccionCliente?.trim(),
//             NoRemision: resultado[0].NoRemision,
//             FechaCreacion: resultado[0].FechaCreacion,
//             Bodeguero: resultado[0].Bodeguero,
//             Despachador: resultado[0].Despachador,
//             Transportador: resultado[0].Transportador,
//             PersonaQueRecibe: resultado[0].PersonaQueRecibe,
//             PlacaVehiculoRecibe: resultado[0].PlacaVehiculoRecibe,
//         };

//         const items = resultado.map(({ NombreEquipo, Cantidad }) => ({
//             NombreEquipo,
//             Cantidad
//         }));

//         return res.status(200).json({
//             cabecera: datosGenerales,
//             items: items
//         });

//     } catch (error) {
//         console.error('Error en GenerarPDFController => ', error);
//         res.status(500).json({ error: `Error al generar el PDF de la remisión con id: ${req.params.IdRemision} => ${error}` });
//     }
// };

// module.exports = {
//     GenerarPDFController
// };

// 'playwright'
// 'pdfmake'

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright'); // ES compatible con require


// const fs = require('fs');
// const path = require('path');
const PdfPrinter = require('pdfmake');
const { InfoPDFService } = require('../../../services/comercial/remisiones/InfoPDFService');
const { PlantillaPDFRemision } = require('../../../templates/Remision/PlantillaPDFRemision.Template');
const { FechaActualColombia } = require('../../../utils/FechaActualColombia');

const Herramienta = 'playwright';
// const Herramienta = 'pdfmake';


const GenerarPDFRemisionController = async (req, res) => {
    if (Herramienta === 'playwright') {
        const LogoImagenBase64 = `data:image/png;base64,${fs.readFileSync(path.resolve(__dirname, '../../../image/LogoCompany.png')).toString('base64')}`;
        const IconoWhatsApp = `data:image/svg+xml;base64,${fs.readFileSync(path.resolve(__dirname, '../../../image/icono-whatsapp.svg')).toString('base64')}`;
        const IconoDireccion = `data:image/svg+xml;base64,${fs.readFileSync(path.resolve(__dirname, '../../../image/icono-direccion.svg')).toString('base64')}`;
        const IconoEmail = `data:image/png;base64,${fs.readFileSync(path.resolve(__dirname, '../../../image/icono-email.png')).toString('base64')}`;
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

            // return res.status(200).json(
            //     data
            // )

            // Carga la plantilla HTML
            const templatePath = path.join(__dirname, '../../../templates/Remision/PlantillaRemision.Template.html');
            let html = fs.readFileSync(templatePath, 'utf8');

            // Genera las filas de la tabla
            const rows = items.map(item => `
                <tr class="SinBordesDobles">
                    <td class="BordesNegros1px SinBordesDobles">${item.cantidad}</td>    
                    <td class="BordesNegros1px SinBordesDobles">${item.nombre}</td>
                    <td class="BordesNegros1px SinBordesDobles">${item.observaciones}</td>
                </tr>
            `).join('');

            // // Se lee archivo css con estilos 
            const css = fs.readFileSync(path.join(__dirname, '../../../templates/Remision/Style.css'), 'utf8');

            // // Reemplaza los valores en el template
            // html = html
            //     .replace('</head>', `<style>${css}</style></head>`)
            //     .replace('{{LogoImagenBase64}}', LogoImagenBase64)
            //     // .replace('{{NoRemision}}', cabecera.NoRemision)
            //     .replace(/{{NoRemision}}/g, cabecera.NoRemision)
            //     .replace('{{Cliente}}', cabecera.Cliente)
            //     .replace('{{Proyecto}}', cabecera.Proyecto)
            //     .replace('{{rows}}', rows)
            //     .replace('{{IconoWhatsApp}}', IconoWhatsApp)
            //     .replace('{{IconoDireccion}}', IconoDireccion)
            //     .replace('{{IconoEmail}}', IconoEmail)
            //     .replace('{{FechaRemision}}', cabecera.FechaCreacion)
            //     .replace('{{Cliente}}', cabecera.Cliente)
            //     .replace('{{DocumentoCliente}}', cabecera.DocumentoCliente)
            //     .replace('{{DireccionProyecto}}', cabecera.DireccionProyecto)
            //     .replace('{{Proyecto}}', cabecera.Proyecto)
            //     .replace('{{Celular}}', cabecera.Celular)
            //     ;

            const reemplazos = {
                '{{LogoImagenBase64}}': LogoImagenBase64,
                '{{NoRemision}}': cabecera.NoRemision,
                '{{Cliente}}': cabecera.Cliente,
                '{{Proyecto}}': cabecera.Proyecto,
                '{{rows}}': rows,
                '{{IconoWhatsApp}}': IconoWhatsApp,
                '{{IconoDireccion}}': IconoDireccion,
                '{{IconoEmail}}': IconoEmail,
                '{{FechaRemision}}': cabecera.FechaCreacion,
                '{{DocumentoCliente}}': cabecera.DocumentoCliente,
                '{{DireccionProyecto}}': cabecera.DireccionProyecto,
                '{{Celular}}': cabecera.Celular ?? '',
                '{{Contacto}}': cabecera.Contacto ?? '',
                '{{Bodeguero}}': cabecera.Bodeguero,
                '{{Despachador}}': cabecera.Despachador,
                '{{Transportador}}': cabecera.Transportador,
                '{{PersonaQueRecibe}}': cabecera.PersonaQueRecibe,
                '{{PlacaVehiculo}}': cabecera.PlacaVehiculo,
                '{{PlacaVehiculoRecibe}}': cabecera.PlacaVehiculoRecibe
            };

            // Reemplazo múltiple usando regex global
            for (const [clave, valor] of Object.entries(reemplazos)) {
                html = html.replace(new RegExp(clave, 'g'), valor);
            }

            // Inserta los estilos CSS antes del cierre de </head>
            html = html.replace('</head>', `<style>${css}</style></head>`);


            // Usa Playwright para renderizar y generar el PDF
            const browser = await chromium.launch();
            const page = await browser.newPage();

            await page.setContent(html, { waitUntil: 'domcontentloaded' });

            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: { top: '0px', bottom: '4px', left: '10px', right: '10px' }
            });

            await browser.close();

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename=remision-${cabecera.NoRemision}.pdf`);
            res.end(pdfBuffer);

        } catch (error) {
            console.error('Error al generar PDF con Playwright:', error);
            res.status(500).json({ error: 'Error generando PDF' });
        }
    } else if (Herramienta === 'pdfmake') {
        const RutaLogo = path.join(__dirname, '../../../image/LogoCompany.png');
        const LogoBase64 = fs.readFileSync(RutaLogo).toString('base64');
        const LogoImageBase64 = `data:image/png;base64,${LogoBase64}`;

        const fonts = {
            Roboto: {
                normal: path.join(__dirname, '../../../fonts/Roboto/static/Roboto-Regular.ttf'),
                bold: path.join(__dirname, '../../../fonts/Roboto/static/Roboto-Bold.ttf'),
                italics: path.join(__dirname, '../../../fonts/Roboto/static/Roboto-Italic.ttf'),
                bolditalics: path.join(__dirname, '../../../fonts/Roboto/static/Roboto-BoldItalic.ttf'),
            }
        };

        const printer = new PdfPrinter(fonts);

        try {
            const { IdRemision } = req.params;
            const data = await InfoPDFService(IdRemision);

            if (!data || data.length === 0) {
                return res.status(404).json({ error: 'Remisión no encontrada' });
            }

            const cabecera = data[0];
            const items = data.map(d => [d.NombreEquipo, d.Cantidad.toString(), d.ObservacionesClienteItem || '']);

            const docDefinition = PlantillaPDFRemision(cabecera, items, LogoImageBase64, FechaActualColombia());

            const pdfDoc = printer.createPdfKitDocument(docDefinition);
            const chunks = [];

            pdfDoc.on('data', chunk => chunks.push(chunk));
            pdfDoc.on('end', () => {
                const result = Buffer.concat(chunks);
                res.setHeader('Content-Type', 'application/pdf');
                // res.setHeader('Content-Disposition', `attachment; filename=remision-${cabecera.NoRemision}.pdf`); // El attachment fuerza la descarga automáticamente
                res.setHeader('Content-Disposition', `filename=remision-${cabecera.NoRemision}.pdf`);
                // res.setHeader('Content-Disposition', 'inline', `filename=RemisionNo${cabecera.NoRemision}`); // o 'attachment' para forzar descarga
                res.end(result);
            });

            pdfDoc.end();

        } catch (error) {
            console.error('Error generando PDF:', error);
            res.status(500).json({ error: 'Error generando PDF' });
        }
    } else {
        res.status(500).json({ error: 'Herramienta desconocida para generar PDF' });
    }
}

module.exports = {
    GenerarPDFRemisionController
}