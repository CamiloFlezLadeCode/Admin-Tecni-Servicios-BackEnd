const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

class PDFGeneratorService {
    /**
     * Constructor de la clase
     * @param {Object} options - Opciones de configuración
     * @param {string} options.templatesDir - Directorio base de plantillas
     * @param {string} options.imagesDir - Directorio base de imágenes
     * @param {string} options.defaultTemplate - Plantilla HTML por defecto
     * @param {string} options.defaultCSS - CSS por defecto
     */
    constructor(options = {}) {
        this.templatesDir = options.templatesDir || path.join(__dirname, '../../templates');
        this.imagesDir = options.imagesDir || path.join(__dirname, '../../images');
        this.defaultTemplate = options.defaultTemplate || 'default.html';
        this.defaultCSS = options.defaultCSS || 'default.css';
        this.browser = null;
        this.page = null;
        this.initialized = false;
    }

    /**
     * Inicializa el navegador y la página de Playwright
     */
    async init() {
        if (this.initialized) return;

        this.browser = await chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        this.page = await this.browser.newPage();
        this.initialized = true;
    }

    /**
     * Cierra el navegador de Playwright
     */
    async close() {
        if (this.browser) {
            await this.browser.close();
            this.initialized = false;
        }
    }

    /**
     * Carga una imagen como base64
     * @param {string} imagePath - Ruta de la imagen
     * @param {string} mimeType - Tipo MIME de la imagen
     * @returns {string} Imagen en formato base64
     */
    loadImageAsBase64(imagePath, mimeType = 'image/png') {
        try {
            const fullPath = path.resolve(this.imagesDir, imagePath);
            const base64 = fs.readFileSync(fullPath).toString('base64');
            return `data:${mimeType};base64,${base64}`;
        } catch (error) {
            console.error(`Error loading image ${imagePath}:`, error);
            return '';
        }
    }

    /**
     * Carga una plantilla HTML
     * @param {string} templateName - Nombre del archivo de plantilla
     * @returns {string} Contenido del template HTML
     */
    loadTemplate(templateName) {
        try {
            const templatePath = path.join(this.templatesDir, templateName);
            return fs.readFileSync(templatePath, 'utf8');
        } catch (error) {
            console.error(`Error loading template ${templateName}:`, error);
            throw new Error(`Template ${templateName} not found`);
        }
    }

    /**
     * Carga un archivo CSS
     * @param {string} cssName - Nombre del archivo CSS
     * @returns {string} Contenido del CSS
     */
    loadCSS(cssName) {
        // Si no se proporciona nombre de CSS, retorna cadena vacía
        if (!cssName) return '';
        try {
            // const cssPath = path.join(this.templatesDir, cssName);
            // return fs.readFileSync(cssPath, 'utf8');
            const cssPath = path.join(this.templatesDir, cssName);

            // Verifica si el archivo existe antes de intentar leerlo
            if (!fs.existsSync(cssPath)) {
                console.warn(`CSS file ${cssName} not found in templates directory`);
                return '';
            }

            return fs.readFileSync(cssPath, 'utf8');
        } catch (error) {
            console.error(`Error loading CSS ${cssName}:`, error);
            return '';
        }
    }

    /**
     * Procesa los reemplazos en el HTML
     * @param {string} html - HTML original
     * @param {Object} replacements - Objeto con los reemplazos
     * @returns {string} HTML procesado
     */
    processReplacements(html, replacements) {
        let processedHtml = html;
        for (const [key, value] of Object.entries(replacements)) {
            const regex = new RegExp(key, 'g');
            processedHtml = processedHtml.replace(regex, value);
        }
        return processedHtml;
    }

    /**
     * Genera filas de tabla HTML a partir de datos
     * @param {Array} items - Array de items
     * @param {Object} options - Opciones para generar las filas
     * @param {Array} options.columns - Columnas a incluir
     * @param {Object} options.classes - Clases CSS para las celdas
     * @returns {string} HTML de las filas de la tabla
     */
    generateTableRows(items, options = {}) {
        const defaultOptions = {
            columns: ['nombre', 'cantidad', 'observaciones'],
            classes: {
                row: 'SinBordesDobles',
                cell: 'BordesNegros1px SinBordesDobles'
            }
        };

        const { columns, classes } = { ...defaultOptions, ...options };

        return items.map(item => {
            const cells = columns.map(col =>
                `<td class="${classes.cell}">${item[col] || ''}</td>`
            ).join('');

            return `<tr class="${classes.row}">${cells}</tr>`;
        }).join('');
    }

    /**
     * Genera un PDF
     * @param {Object} config - Configuración del PDF
     * @param {string} config.template - Nombre de la plantilla
     * @param {string} config.css - Nombre del CSS
     * @param {Object} config.replacements - Reemplazos para la plantilla
     * @param {Object} config.pdfOptions - Opciones para Playwright
     * @returns {Buffer} Buffer del PDF generado
     */
    async generatePDF(config = {}) {
        if (!this.initialized) await this.init();

        const {
            template = this.defaultTemplate,
            css = this.defaultCSS,
            replacements = {},
            pdfOptions = {}
        } = config;

        try {
            // Cargar plantilla y CSS
            let html = this.loadTemplate(template);
            const cssContent = this.loadCSS(css);

            // Procesar reemplazos
            html = this.processReplacements(html, replacements);

            // Insertar CSS
            html = html.replace('</head>', `<style>${cssContent}</style></head>`);

            // Configurar página y generar PDF
            await this.page.setContent(html, { waitUntil: 'domcontentloaded' });

            const defaultPdfOptions = {
                format: 'letter',
                printBackground: true,
                margin: { top: '0px', bottom: '12px', left: '10px', right: '10px' }
            };

            const finalPdfOptions = { ...defaultPdfOptions, ...pdfOptions };
            return await this.page.pdf(finalPdfOptions);

        } catch (error) {
            console.error('Error generating PDF:', error);
            throw error;
        }
    }

    /**
     * Genera y envía el PDF como respuesta HTTP
     * @param {Object} res - Objeto de respuesta Express
     * @param {Buffer} pdfBuffer - Buffer del PDF
     * @param {string} filename - Nombre del archivo
     * @param {boolean} inline - Mostrar en navegador o forzar descarga
     */
    sendPDFResponse(res, pdfBuffer, filename, inline = true) {
        try {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader(
                'Content-Disposition',
                `${inline ? 'inline' : 'attachment'}; filename="${filename}"`
            );
            res.end(pdfBuffer);
        } catch (error) {
            console.error('Error sending PDF response:', error);
            throw error;
        }
    }
}

module.exports = PDFGeneratorService;