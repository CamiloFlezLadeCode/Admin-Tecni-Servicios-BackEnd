const path = require('path');
const PDFGeneratorService = require('../../../utils/GeneradorPDF');
const { GenerarPDFOrdenDeServicioService } = require('../../../services/comercial/ordenes_de_servicio/GenerarPDFOrdenDeServicioService');

// Configuración inicial
const pdfGenerator = new PDFGeneratorService({
    templatesDir: path.join(__dirname, '../../../templates/General'),
    imagesDir: path.join(__dirname, '../../../images'),
    defaultTemplate: 'PlantillaClasicaActual.Template.html',
    defaultCSS: 'StyleClasica.css'
});

const GenerarPDFOrdenDeServicioController = async (req, res) => {
    try {
        // const { IdOrdenDeServicio } = req.params;
        const { IdOrdenDeServicio } = req.query;
        const data = await GenerarPDFOrdenDeServicioService(IdOrdenDeServicio);

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Orden de sercicio no encontrada' });
        }

        const cabecera = data[0];
        const items = data.map(d => ({
            cantidad: d.Cantidad || '',
            observaciones: d.DescripcionEquipo || '',
            repuesto: d.NombreRepuesto
        }));

        const tablaHTML = `
        <table class="SinBordesDobles TableInfoItems BordesNegros1px" style="width: 100%; margin-top: 20px;">
            <thead>
                <tr>
                    <th class="BordesNegros1px" style="width: 12%; padding: 4px; text-align: left;">CANTIDAD</th>
                    <th class="BordesNegros1px" style="width: 88%; padding: 4px; text-align: left;">DESCRIPCIÓN</th>
                </tr>
            </thead>
            <tbody>
                ${items.map(item => `
                <tr class="SinBordesDobles">
                    <td class="BordesNegros1px SinBordesDobles" style="padding: 4px; text-align: center;">${item.cantidad}</td>
                    <td class="BordesNegros1px SinBordesDobles" style="padding: 4px;">${item.repuesto}</td>
                </tr>
                `).join('')}
                <!-- <tr>
                    <td class="BordesNegros1px SinBordesDobles" style="padding: 4px;"><strong>GARANTÍA</strong></td>
                    <td class="BordesNegros1px SinBordesDobles" style="padding: 4px; text-align: center; justify-content: space-between;">
                        <span style="font-weight: bold;">SI</span>
                        <span style="font-weight: bold;">NO</span>
                    </td>
                </tr> -->
                <tr>
                    <td class="BordesNegros1px SinBordesDobles" style="padding: 4px;"><strong>GARANTÍA</strong></td>
                    <td class="BordesNegros1px SinBordesDobles" style="padding: 4px; position: relative;">
                        <div style="display: flex; justify-content: space-evenly; position: relative;">
                            ${cabecera.Garantia === 0 ? `
                                <span style="font-weight: bold;">SI<div style="border-bottom: solid #000000 1.2px; display: inline-block;"><input  type="checkbox"/></div></span>
                                <span style="font-weight: bold;">NO<div style="border-bottom: solid #000000 1.2px; display: inline-block;"><input  type="checkbox" checked/></div></span>                           
                                ` : `
                                <span style="font-weight: bold;">SI<div style="border-bottom: solid #000000 1.2px; display: inline-block;"><input  type="checkbox" checked/></div></span>
                                <span style="font-weight: bold;">NO<div style="border-bottom: solid #000000 1.2px; display: inline-block;"><input  type="checkbox"/></div></span>                           
                                `
            }    
                        </div>
                    </td>
                </tr>
                <tr>
                <td style="padding: 5px;" colspan="2" class="BordesNegros1Pixel">
                        <p style="margin: 0; color: red; text-align: justify; font-size: 16px; font-weight: normal;">
                            Después de reparada la herramienta, tiene plazo de 45 días calendario para reclamarla, de lo contrario se le cobrará hasta 50% del arreglo o reparación por concepto de recargo y bodegaje
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
        <table class="SinBordesDobles TableInfoItems BordesNegros1px" style="width: 100%; margin-top: 0px; border-top: none;">
            <tbody>
                <tr>
                    <td colspan="2" class="BordesNegros1Pixel" style="border-top: none; padding-left: 10px; padding-right: 10px;">
                        <div style="white-space: pre-line; text-align: justify;">
                            <strong>DESCRIPCIÓN: </strong> <br>
                            ${cabecera.Descripcion}
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" class="BordesNegros1Pixel" style="padding-left: 10px; padding-right: 10px;">
                        <div style="white-space: pre-line; text-align: justify;">
                            <strong>OBSERVACIONES: </strong> <br>
                            ${cabecera.Observaciones}
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- FIRMAS -->
        <table class="TablaFirmas SinBordesDobles">
            <tr>
                <td class="CeldaContenedorFirma">
                    <div class="ContenedorFirma">
                        <span>${cabecera.PersonaQueEntrega}</span>
                    </div>
                    <span>Entrega</span>
                </td>
                <td class="CeldaContenedorFirma">
                    <div class="ContenedorFirma">
                        <span>${cabecera.PersonaQueRecibe}</span>
                    </div>
                    <span>Recibe</span>
                </td>
            </tr>
        </table>
        `;

        // Configurar reemplazos
        const replacements = {
            // INFO ENCABEZADO
            '{{LogoImagenBase64}}': pdfGenerator.loadImageAsBase64('LogoCompany.png'),
            '{{TituloDocumento}}': 'ORDEN DE SERVICIO',
            '{{CodigoDocumento}}': 'GTH-F-10',
            '{{VersionDocumento}}': '01',
            '{{VigenciaDocumento}}': 'Marzo 2025',
            // INFO EMPRESA PRINCIPAL
            '{{NombreEmpresa}}': 'TECNISERVICIOS J.F S.A.S',
            '{{MisionEmpresa}}': 'Reparación y alquiler de equipos para la construcción.',
            '{{NITEmpresa}}': '901893972-3',
            // TIPO Y NO CONSECUTIVO DOCUMENTO
            '{{TipoDocumento}}': 'Orden de servicio',
            '{{NoDocumento}}': cabecera.NoOrdenDeServicio,
            // INFORMACIÓN DE CLIENTE
            // '{{FechaDocumento}}': cabecera.FechaCreacion,
            '{{FechaDocumento}}': cabecera.FechaOrdenDeServicio,
            '{{Cliente}}': cabecera.Cliente,
            '{{DocumentoCliente}}': cabecera.DocumentoCliente,
            '{{DireccionProyecto}}': cabecera.DireccionProyecto,
            '{{Proyecto}}': cabecera.Proyecto,
            '{{Celular}}': cabecera.Celular ?? '',
            '{{Contacto}}': cabecera.Contacto ?? '',
            // IINFO CONTENIDO/CUERPO PDF            
            '{{{contenido}}}': tablaHTML,
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
                margin: { top: '0px', bottom: '12px', left: '15px', right: '15px' }
            }
        });

        // Enviar respuesta
        pdfGenerator.sendPDFResponse(res, pdfBuffer, `remision-${cabecera.NoRemision}.pdf`, true);

    } catch (error) {
        console.error('Error al generar PDF:', error);
        return res.status(500).json({ error: 'Error generando PDF' });
    } finally {
        await pdfGenerator.close();
    }
};
module.exports = {
    GenerarPDFOrdenDeServicioController
};