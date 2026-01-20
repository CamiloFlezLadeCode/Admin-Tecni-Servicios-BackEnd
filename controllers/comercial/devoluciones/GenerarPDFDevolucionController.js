const path = require('path');
const PDFGeneratorService = require('../../../utils/GeneradorPDF');
const { GenerarPDFDevolucionService } = require('../../../services/comercial/devoluciones/GenerarPDFDevolucionService');

// Configuración inicial
const pdfGenerator = new PDFGeneratorService({
    templatesDir: path.join(__dirname, '../../../templates/General'),
    imagesDir: path.join(__dirname, '../../../images'),
    defaultTemplate: 'PlantillaClasicaActual.Template.html',
    defaultCSS: 'StyleClasica.css'
});

const GenerarPDFDevolucionController = async (req, res) => {
    try {
        const { IdDevolucion } = req.query;
        const data = await GenerarPDFDevolucionService(IdDevolucion);

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Devolución no encontrada' });
        }

        const cabecera = data[0];
        const items = data.map(d => ({
            CantidadEntregada: d.CantidadEntregada,
            EquipoEntregado: d.EquipoEntregado,
            EstadoEquipoEntregado: d.EstadoEquipoEntregado
        }));

        if (cabecera.IncluyeTransporte) {
            items.push({
                CantidadEntregada: 1,
                EquipoEntregado: `SERVICIO DE TRANSPORTE`,
                // EquipoEntregado: `SERVICIO DE TRANSPORTE - Valor: $ ${new Intl.NumberFormat('es-CO').format(cabecera.ValorTransporte)}`,
                EstadoEquipoEntregado: 'N/A'
            });
        }

        const HTMLMANUAL = `
            <!-- <p>${cabecera.Observaciones}asdfasdfasfasdf</p> -->

            <table class="SinBordesDobles TableInfoItems BordesNegros1px" style="width: 100%; margin-top: 20px;">
                <thead>
                    <tr>
                        <th class="BordesNegros1px" style="width: 12%; padding: 4px; text-align: left;">CANTIDAD</th>
                        <th class="BordesNegros1px" style="width: 60%; padding: 4px; text-align: left;">EQUIPO</th>
                        <th class="BordesNegros1px" style="width: 28%; padding: 4px; text-align: left;">ESTADO EQUIPO</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map(item => `
                        <tr class="SinBordesDobles">
                            <td class="BordesNegros1px SinBordesDobles" style="padding: 4px; text-align: center;">${item.CantidadEntregada}</td>
                            <td class="BordesNegros1px SinBordesDobles" style="padding: 4px;">${item.EquipoEntregado}</td>
                            <td class="BordesNegros1px SinBordesDobles" style="padding: 4px;">${item.EstadoEquipoEntregado}</td>
                        </tr>
                    `).join('') //Se agrega un espacio en blanco con .join('') para separar los items y evitar caracteres raros en el html
                    } 
                </tbody>
            </table>
            <table class="SinBordesDobles TableInfoItems BordesNegros1px" style="width: 100%; margin-top: 0px; border-top: none;">
                <tbody>
                    <tr>
                        <td colspan="2" class="BordesNegros1Pixel" style="padding-left: 10px; padding-right: 10px; border-top: none;">
                            <div style="white-space: pre-line; text-align: justify;"><strong>OBSERVACIONES: </strong> <br>${cabecera.Observaciones}</div>
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
            // '{{TituloDocumentoPDF}}': `Devolucion_No_${cabecera.NoDevolucion}`,
            '{{TituloDocumentoPDF}}': `Devolución_${cabecera.NoDevolucion}_${cabecera.Cliente}`,
            '{{LogoImagenBase64}}': pdfGenerator.loadImageAsBase64('LogoCompany.png'),
            '{{TituloDocumento}}': 'DEVOLUCIÓN',
            '{{CodigoDocumento}}': 'GTH-F-10',
            '{{VersionDocumento}}': '01',
            '{{VigenciaDocumento}}': 'Marzo 2025',
            // INFO EMPRESA PRINCIPAL
            '{{NombreEmpresa}}': 'TECNISERVICIOS J.F S.A.S',
            '{{MisionEmpresa}}': 'Reparación y alquiler de equipos para la construcción.',
            '{{NITEmpresa}}': '901893972-3',
            // TIPO Y NO CONSECUTIVO DOCUMENTO
            '{{TipoDocumento}}': 'Devolución',
            '{{NoDocumento}}': cabecera.NoDevolucion,
            // INFORMACIÓN DE CLIENTE
            // '{{FechaDocumento}}': cabecera.FechaCreacion,
            '{{FechaDocumento}}': cabecera.FechaDevolucion,
            '{{Cliente}}': cabecera.Cliente,
            '{{DocumentoCliente}}': cabecera.DocumentoCliente,
            '{{DireccionProyecto}}': cabecera.DireccionProyecto,
            '{{Proyecto}}': cabecera.Proyecto,
            '{{Celular}}': [cabecera.Celular1, cabecera.Celular2].filter(Boolean).join(' / '),
            '{{Contacto}}': cabecera.Contacto ?? '',
            // IINFO CONTENIDO/CUERPO PDF            
            '{{{contenido}}}': HTMLMANUAL,
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
        pdfGenerator.sendPDFResponse(res, pdfBuffer, `devolucion-${cabecera.NoDevolucion}.pdf`, true);
    } catch (error) {
        console.error('Error en GenerarPDFDevolucionController => ', error.message);
        return res.status(500).json({ error: `Error al generar el pdf de la devolución => ${error.message}` });
    } finally {
        await pdfGenerator.close();
    }
};
module.exports = {
    GenerarPDFDevolucionController
};