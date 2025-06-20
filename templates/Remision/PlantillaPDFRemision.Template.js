const PlantillaPDFRemision = (cabecera, items, LogoImageBase64, FechaActualColombia) => {
    // 'portrait' → orientación vertical (A4 vertical).
    // 'landscape' → orientación horizontal (A4 horizontal).
    return {
        // pageOrientation: 'landscape', // ⬅️ O usa 'portrait' para vertical (por defecto)
        // pageMargins: [left, top, right, button]
        // margin: [0, 15, 0, 15] // top, right, bottom, left

        pageMargins: [10, 10, 10, 10],
        content: [
            // { image: LogoImageBase64, width: 150, alignment: 'left', margin: [0, 0, 0, 0], border: 'green solid' },
            // {
            //     table: {
            //         widths: ['33%', '33%', '33%'],
            //         body: [
            //             [
            //                 {
            //                     image: LogoImageBase64,
            //                     width: 150,
            //                     alignment: 'left',
            //                     margin: [5, 5, 5, 5] // espacio dentro de la celda
            //                 },
            //                 {
            //                     text: 'REMISIÓN',
            //                     alignment: 'center',
            //                     margin: [50, 50, 0, 0]
            //                 },
            //                 {
            //                     text: `Fecha: ${FechaActualColombia}`,
            //                     alignment: 'right'
            //                 }
            //             ]
            //         ]
            //     },
            //     layout: {
            //         hLineColor: () => '#000000',
            //         vLineColor: () => '#000000',
            //         hLineWidth: () => 1,
            //         vLineWidth: () => 1
            //     },
            //     margin: [0, 0, 0, 20] // margen externo
            // },

            {
                table: {
                    widths: ['33%', '33%', '33%'],
                    body: [
                        [
                            {
                                image: LogoImageBase64,
                                width: 150,
                                alignment: 'left',
                                margin: [5, 5, 5, 5]
                            },
                            {
                                stack: [
                                    { text: 'REMISIÓN', alignment: 'center', style: 'title' }
                                ],
                                alignment: 'center',
                                margin: [0, 15, 0, 15] // vertical spacing (ajustable)
                            },
                            {
                                text: `Fecha: ${FechaActualColombia}`,
                                alignment: 'right',
                                margin: [0, 5, 5, 5]
                            }
                        ]
                    ]
                },
                layout: {
                    hLineColor: () => '#000000',
                    vLineColor: () => '#000000',
                    hLineWidth: () => 1,
                    vLineWidth: () => 1
                },
                margin: [0, 0, 0, 20]
            },


            { text: `Fecha: ${FechaActualColombia}`, alignment: 'right', margin: [0, 0, 0, 0] },

            { text: `REMISIÓN No${cabecera.NoRemision}`, style: 'title' },

            {
                columns: [
                    [
                        { text: 'Datos del Cliente', style: 'sectionHeader' },
                        { text: `Cliente: ${cabecera.Cliente}` },
                        { text: `Correo: ${cabecera.Correo}` },
                        { text: `Teléfono: ${cabecera.Telefono}` },
                        { text: `Celular: ${cabecera.Celular}` },
                        { text: `Dirección: ${cabecera.DireccionCliente}` },
                    ],
                    [
                        { text: 'Datos del Proyecto', style: 'sectionHeader' },
                        { text: `Proyecto: ${cabecera.Proyecto}` },
                        { text: `Dirección: ${cabecera.DireccionProyecto}` },
                        { text: `Fecha de creación: ${cabecera.FechaCreacion}` },
                    ]
                ],
                columnGap: 30,
                margin: [0, 10, 0, 20]
            },

            { text: 'Equipos Entregados', style: 'sectionHeader' },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', 80, '*'],
                    body: [
                        [
                            { text: 'Equipo', style: 'tableHeader' },
                            { text: 'Cantidad', style: 'tableHeader' },
                            { text: 'Observaciones Item', style: 'tableHeader' },
                        ],
                        ...items.map(d => [
                            { text: d[0], style: 'tableCell' },
                            { text: d[1], style: 'tableCell', alignment: 'center' },
                            { text: d[2], style: 'tableCell' },
                        ])
                    ]
                },
                layout: {
                    fillColor: (rowIndex) => rowIndex === 0 ? '#eeeeee' : null
                },
                margin: [0, 0, 0, 0]
            },

            { text: 'Firmas', style: 'sectionHeader' },
            {
                columns: [
                    {
                        width: '33%',
                        stack: [
                            { text: '_________________________', margin: [0, 20, 0, 0] },
                            { text: `Recibe: ${cabecera.PersonaQueRecibe}`, alignment: 'center' },
                            { text: `Placa: ${cabecera.PlacaVehiculoRecibe}`, alignment: 'center' },
                        ]
                    },
                    {
                        width: '33%',
                        stack: [
                            { text: '_________________________', margin: [0, 20, 0, 0] },
                            { text: `Despachador: ${cabecera.Despachador}`, alignment: 'center' },
                        ]
                    },
                    {
                        width: '33%',
                        stack: [
                            { text: '_________________________', margin: [0, 20, 0, 0] },
                            { text: `Bodeguero: ${cabecera.Bodeguero}`, alignment: 'center' },
                        ]
                    }
                ]
            }
        ],
        styles: {
            title: {
                fontSize: 20,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 10]
            },
            sectionHeader: {
                fontSize: 14,
                bold: true,
                margin: [0, 10, 0, 5],
                decoration: 'underline'
            },
            tableHeader: {
                bold: true,
                fillColor: '#eeeeee'
            },
            tableCell: {
                margin: [0, 5, 0, 5]
            }
        },
        defaultStyle: {
            font: 'Roboto',
            fontSize: 11
        }
    }
};

module.exports = {
    PlantillaPDFRemision
};