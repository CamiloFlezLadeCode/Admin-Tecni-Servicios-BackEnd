const { pool } = require('../../../config/db');
const { FechaActualColombia } = require('../../../utils/FechaActualColombia');
const { EmpresaAnfitriona } = require('../../../utils/constant/default');
const ActualizarDevolucionQuery = require('../../../queries/comercial/devoluciones/ActualizarDevolucionQuery');
const { emitirWebSocketDevolucion } = require('../../../utils/websocket/Emit_WebSocket');

const ActualizarDevolucionService = async (Data) => {
    let connection;
    try {
        const {
            IdDevolucion,
            Observaciones,
            PersonaQueRecibe,
            PersonaQueEntrega,
            IncluyeTransporte,
            ValorTransporte,
            Detalles,
            UsuarioQueActualiza
        } = Data || {};

        if (!IdDevolucion) {
            throw new Error('El IdDevolucion es obligatorio');
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        const devolucionActual = await ActualizarDevolucionQuery.getDevolucionById(connection, IdDevolucion);

        if (!devolucionActual) {
            await connection.rollback();
            return {
                code: 404,
                success: false,
                huboCambios: false,
                message: 'Devolución no encontrada',
                detallesActualizados: []
            };
        }

        const detallesActuales = await ActualizarDevolucionQuery.getDetallesDevolucion(connection, IdDevolucion);

        const cantidadDetallesActuales = Array.isArray(detallesActuales) ? detallesActuales.length : 0;
        const cantidadDetallesNuevos = Array.isArray(Detalles) ? Detalles.length : 0;

        if (cantidadDetallesActuales > 0 && cantidadDetallesNuevos === 0) {
            const detallesConPropietario = await ActualizarDevolucionQuery.getDetallesDevolucionConPropietario(connection, IdDevolucion);

            for (const det of detallesConPropietario) {
                const esPropio = det.DocumentoSubarrendatario === EmpresaAnfitriona.value;
                if (!esPropio) {
                    continue;
                }

                const idEquipo = Number(det.IdEquipo);
                const cantidad = Number(det.Cantidad || 0);

                if (cantidad === 0) {
                    continue;
                }

                const equipoInfo = await ActualizarDevolucionQuery.getEquipoInfo(connection, idEquipo);

                if (!equipoInfo) {
                    throw new Error(`No se encontró el equipo ${idEquipo}`);
                }

                const disponible = Number(equipoInfo.CantidadDisponible || 0);

                if (disponible < cantidad) {
                    throw new Error(`La cantidad no puede ser negativa para el equipo ${idEquipo}`);
                }

                await ActualizarDevolucionQuery.updateStockEquipoConDelta(connection, [
                    cantidad,
                    cantidad,
                    cantidad,
                    idEquipo
                ], 'subtract');

                await ActualizarDevolucionQuery.insertMovimientoEquipo(connection, [
                    idEquipo,
                    devolucionActual.FechaDevolucion || FechaActualColombia(),
                    2,
                    'SALIDA',
                    cantidad,
                    devolucionActual.NoDevolucion,
                    IdDevolucion,
                    UsuarioQueActualiza,
                    FechaActualColombia()
                ]);
            }

            await ActualizarDevolucionQuery.deleteDetallesDevolucion(connection, IdDevolucion);
            await ActualizarDevolucionQuery.deleteDevolucion(connection, IdDevolucion);
            await connection.commit();
            await emitirWebSocketDevolucion().devolucionEliminada(IdDevolucion);
            return {
                code: 201,
                success: true,
                huboCambios: true,
                message: 'Devolución eliminada por no tener detalles',
                detallesActualizados: []
            };
        }

        const nuevoHeader = {
            Observaciones: (Observaciones || '').trim(),
            PersonaQueRecibe: PersonaQueRecibe ? String(PersonaQueRecibe).trim() : null,
            PersonaQueEntrega: PersonaQueEntrega ? String(PersonaQueEntrega).trim() : null,
            IncluyeTransporte: IncluyeTransporte ? 1 : 0,
            ValorTransporte: Number(ValorTransporte || 0),
            IdEstado: 17
        };

        const headerActual = {
            Observaciones: (devolucionActual.Observaciones || '').trim(),
            PersonaQueRecibe: devolucionActual.PersonaQueRecibe ? String(devolucionActual.PersonaQueRecibe).trim() : null,
            PersonaQueEntrega: devolucionActual.PersonaQueEntrega ? String(devolucionActual.PersonaQueEntrega).trim() : null,
            IncluyeTransporte: devolucionActual.IncluyeTransporte ? 1 : 0,
            ValorTransporte: Number(devolucionActual.ValorTransporte || 0),
            IdEstado: devolucionActual.IdEstado
        };

        const cambiosCabecera = {
            Observaciones: nuevoHeader.Observaciones !== headerActual.Observaciones,
            PersonaQueRecibe: nuevoHeader.PersonaQueRecibe !== headerActual.PersonaQueRecibe,
            PersonaQueEntrega: nuevoHeader.PersonaQueEntrega !== headerActual.PersonaQueEntrega,
            IncluyeTransporte: nuevoHeader.IncluyeTransporte !== headerActual.IncluyeTransporte,
            ValorTransporte: nuevoHeader.ValorTransporte !== headerActual.ValorTransporte
        };

        const huboCambiosCabecera = Object.values(cambiosCabecera).some(Boolean);

        const mapaDetallesActuales = new Map();
        for (const det of detallesActuales) {
            mapaDetallesActuales.set(Number(det.IdDetalleDevolucion), det);
        }

        const detallesAActualizar = [];

        if (Array.isArray(Detalles)) {
            for (const detNuevo of Detalles) {
                const idDetalle = Number(detNuevo.IdDetalleDevolucion);
                if (!idDetalle) {
                    continue;
                }

                const detActual = mapaDetallesActuales.get(idDetalle);

                if (!detActual) {
                    throw new Error(`No se encontró el detalle con IdDetalleDevolucion ${idDetalle} para la devolución ${IdDevolucion}`);
                }

                const cantidadNueva = Number(
                    detNuevo.CantidadDevuelta ??
                    detNuevo.CantidadADevolver ??
                    detNuevo.Cantidad ??
                    0
                );
                const estadoNuevo = Number(detNuevo.EstadoEquipo);

                const cantidadActual = Number(detActual.Cantidad || 0);
                const estadoActual = Number(detActual.IdEstado || 0);

                const hayCambioCantidad = cantidadNueva !== cantidadActual;
                const hayCambioEstado = estadoNuevo !== estadoActual;

                if (hayCambioCantidad || hayCambioEstado) {
                    detallesAActualizar.push({
                        IdDetalleDevolucion: idDetalle,
                        IdEquipo: Number(detActual.IdEquipo),
                        CantidadAnterior: cantidadActual,
                        Cantidad: cantidadNueva,
                        IdEstado: estadoNuevo,
                        DocumentoSubarrendatario: detNuevo.DocumentoSubarrendatario
                    });
                }
            }
        }

        const huboCambiosDetalles = detallesAActualizar.length > 0;
        const huboCambios = huboCambiosCabecera || huboCambiosDetalles;

        const diffsStock = new Map();

        if (huboCambiosDetalles) {
            for (const det of detallesAActualizar) {
                const esPropio = det.DocumentoSubarrendatario === EmpresaAnfitriona.value;
                if (!esPropio) {
                    continue;
                }

                const delta = Number(det.Cantidad) - Number(det.CantidadAnterior || 0);
                if (delta === 0) {
                    continue;
                }

                const idEquipo = Number(det.IdEquipo);
                diffsStock.set(idEquipo, (diffsStock.get(idEquipo) || 0) + delta);
            }
        }

        if (!huboCambios) {
            await connection.rollback();
            return {
                code: 204,
                success: true,
                huboCambios: false,
                message: 'No se detectaron cambios en la devolución',
                detallesActualizados: []
            };
        }

        const equiposConMovimiento = [];

        for (const [idEquipo, delta] of diffsStock.entries()) {
            if (delta === 0) {
                continue;
            }

            const equipoInfo = await ActualizarDevolucionQuery.getEquipoInfo(connection, idEquipo);

            if (!equipoInfo) {
                throw new Error(`No se encontró el equipo ${idEquipo}`);
            }

            const disponible = Number(equipoInfo.CantidadDisponible || 0);

            if (delta < 0 && disponible < Math.abs(delta)) {
                throw new Error(`La cantidad no puede ser negativa para el equipo ${idEquipo}`);
            }

            await ActualizarDevolucionQuery.updateStockEquipoConDelta(connection, [
                delta,
                delta,
                delta,
                idEquipo
            ], 'add');

            const direccion = delta > 0 ? 'ENTRADA' : 'SALIDA';
            const cantidadMovimiento = Math.abs(delta);

            await ActualizarDevolucionQuery.insertMovimientoEquipo(connection, [
                idEquipo,
                devolucionActual.FechaDevolucion || FechaActualColombia(),
                2,
                direccion,
                cantidadMovimiento,
                devolucionActual.NoDevolucion,
                IdDevolucion,
                UsuarioQueActualiza,
                FechaActualColombia()
            ]);

            equiposConMovimiento.push(idEquipo);
        }

        if (huboCambios) {
            await ActualizarDevolucionQuery.updateCabeceraDevolucion(connection, [
                nuevoHeader.Observaciones,
                nuevoHeader.PersonaQueRecibe,
                nuevoHeader.PersonaQueEntrega,
                nuevoHeader.IncluyeTransporte,
                nuevoHeader.ValorTransporte,
                nuevoHeader.IdEstado,
                IdDevolucion
            ]);
        }

        if (huboCambiosDetalles) {
            for (const det of detallesAActualizar) {
                await ActualizarDevolucionQuery.updateDetalleDevolucion(connection, [
                    det.Cantidad,
                    det.IdEstado,
                    det.IdDetalleDevolucion
                ]);
            }
        }

        await connection.commit();

        return {
            code: 200,
            success: true,
            huboCambios: true,
            message: 'Devolución actualizada correctamente',
            detallesActualizados: {
                cabecera: cambiosCabecera,
                detalles: detallesAActualizar.map(det => det.IdDetalleDevolucion),
                equiposConMovimiento
            }
        };
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Error al actualizar la devolución: ', error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

module.exports = {
    ActualizarDevolucionService
};
