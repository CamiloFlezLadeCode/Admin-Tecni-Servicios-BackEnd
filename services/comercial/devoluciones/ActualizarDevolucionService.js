const { pool } = require("../../../config/db");
const { FechaActualColombia } = require("../../../utils/FechaActualColombia");
const { EmpresaAnfitriona } = require("../../../utils/constant/default");
const ActualizarDevolucionQuery = require("../../../queries/comercial/devoluciones/ActualizarDevolucionQuery");
const {
  emitirWebSocketDevolucion,
} = require("../../../utils/websocket/Emit_WebSocket");

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
      UsuarioQueActualiza,
      FechaDevolucion,
    } = Data || {};

    if (!IdDevolucion) {
      throw new Error("El IdDevolucion es obligatorio");
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const devolucionActual = await ActualizarDevolucionQuery.getDevolucionById(
      connection,
      IdDevolucion,
    );

    if (!devolucionActual) {
      await connection.rollback();
      return {
        code: 404,
        success: false,
        huboCambios: false,
        message: "Devolución no encontrada",
        detallesActualizados: [],
      };
    }

    const detallesActuales =
      await ActualizarDevolucionQuery.getDetallesDevolucion(
        connection,
        IdDevolucion,
      );

    const cantidadDetallesActuales = Array.isArray(detallesActuales)
      ? detallesActuales.length
      : 0;
    const cantidadDetallesNuevos = Array.isArray(Detalles)
      ? Detalles.length
      : 0;

    const fechaDevolucionNueva = new Date(FechaDevolucion);

    if (cantidadDetallesActuales > 0 && cantidadDetallesNuevos === 0) {
      const detallesConPropietario =
        await ActualizarDevolucionQuery.getDetallesDevolucionConPropietario(
          connection,
          IdDevolucion,
        );

      for (const det of detallesConPropietario) {
        const esPropio =
          det.DocumentoSubarrendatario === EmpresaAnfitriona.value;
        if (!esPropio) {
          continue;
        }

        const idEquipo = Number(det.IdEquipo);
        const cantidad = Number(det.Cantidad || 0);

        if (cantidad === 0) {
          continue;
        }

        const equipoInfo = await ActualizarDevolucionQuery.getEquipoInfo(
          connection,
          idEquipo,
        );

        if (!equipoInfo) {
          throw new Error(`No se encontró el equipo ${idEquipo}`);
        }

        const disponible = Number(equipoInfo.CantidadDisponible || 0);

        if (disponible < cantidad) {
          throw new Error(
            `La cantidad no puede ser negativa para el equipo ${idEquipo}`,
          );
        }

        await ActualizarDevolucionQuery.updateStockEquipoConDelta(
          connection,
          [cantidad, cantidad, cantidad, idEquipo],
          "subtract",
        );

        await ActualizarDevolucionQuery.insertMovimientoEquipo(connection, [
          idEquipo,
          devolucionActual.FechaDevolucion || FechaActualColombia(),
          2,
          "SALIDA",
          cantidad,
          devolucionActual.NoDevolucion,
          IdDevolucion,
          UsuarioQueActualiza,
          FechaActualColombia(),
        ]);
      }

      await ActualizarDevolucionQuery.deleteDetallesDevolucion(
        connection,
        IdDevolucion,
      );
      await ActualizarDevolucionQuery.deleteDevolucion(
        connection,
        IdDevolucion,
      );
      await connection.commit();
      await emitirWebSocketDevolucion().devolucionEliminada(IdDevolucion);
      return {
        code: 201,
        success: true,
        huboCambios: true,
        message: "Devolución eliminada por no tener detalles",
        detallesActualizados: [],
      };
    }

    const nuevoHeader = {
      Observaciones: (Observaciones || "").trim(),
      PersonaQueRecibe: PersonaQueRecibe
        ? String(PersonaQueRecibe).trim()
        : null,
      PersonaQueEntrega: PersonaQueEntrega
        ? String(PersonaQueEntrega).trim()
        : null,
      IncluyeTransporte: IncluyeTransporte ? 1 : 0,
      ValorTransporte: Number(ValorTransporte || 0),
      FechaDevolucion: fechaDevolucionNueva,
      IdEstado: 17,
    };

    const headerActual = {
      Observaciones: (devolucionActual.Observaciones || "").trim(),
      PersonaQueRecibe: devolucionActual.PersonaQueRecibe
        ? String(devolucionActual.PersonaQueRecibe).trim()
        : null,
      PersonaQueEntrega: devolucionActual.PersonaQueEntrega
        ? String(devolucionActual.PersonaQueEntrega).trim()
        : null,
      IncluyeTransporte: devolucionActual.IncluyeTransporte ? 1 : 0,
      ValorTransporte: Number(devolucionActual.ValorTransporte || 0),
      FechaDevolucion: devolucionActual.FechaDevolucion
        ? new Date(devolucionActual.FechaDevolucion)
        : null,
      IdEstado: devolucionActual.IdEstado,
    };

    const cambiosCabecera = {
      Observaciones: nuevoHeader.Observaciones !== headerActual.Observaciones,
      PersonaQueRecibe:
        nuevoHeader.PersonaQueRecibe !== headerActual.PersonaQueRecibe,
      PersonaQueEntrega:
        nuevoHeader.PersonaQueEntrega !== headerActual.PersonaQueEntrega,
      IncluyeTransporte:
        nuevoHeader.IncluyeTransporte !== headerActual.IncluyeTransporte,
      ValorTransporte:
        nuevoHeader.ValorTransporte !== headerActual.ValorTransporte,
      FechaDevolucion:
        nuevoHeader.FechaDevolucion && headerActual.FechaDevolucion
          ? nuevoHeader.FechaDevolucion.getTime() !==
            headerActual.FechaDevolucion.getTime()
          : !!nuevoHeader.FechaDevolucion !== !!headerActual.FechaDevolucion,
    };

    const huboCambiosCabecera = Object.values(cambiosCabecera).some(Boolean);

    const mapaDetallesActuales = new Map();
    for (const det of detallesActuales) {
      mapaDetallesActuales.set(Number(det.IdDetalleDevolucion), det);
    }

    const detallesAActualizar = [];
    const detallesANuevos = [];
    const detallesAEliminar = [];
    const idsDetallesPayload = new Set();

    if (Array.isArray(Detalles)) {
      for (const detNuevo of Detalles) {
        const idDetalle = Number(detNuevo.IdDetalleDevolucion);
        const cantidadNueva = Number(
          detNuevo.CantidadDevuelta ??
            detNuevo.CantidadADevolver ??
            detNuevo.Cantidad ??
            0,
        );
        const estadoNuevo = Number(detNuevo.EstadoEquipo);

        if (!Number.isFinite(cantidadNueva) || cantidadNueva <= 0) {
          throw new Error("La cantidad devuelta debe ser mayor a 0");
        }

        if (idDetalle) {
          idsDetallesPayload.add(idDetalle);
          const detActual = mapaDetallesActuales.get(idDetalle);

          if (!detActual) {
            throw new Error(
              `No se encontró el detalle con IdDetalleDevolucion ${idDetalle} para la devolución ${IdDevolucion}`,
            );
          }

          const cantidadActual = Number(detActual.Cantidad || 0);
          const estadoActual = Number(detActual.IdEstado || 0);
          const hayCambioCantidad = cantidadNueva !== cantidadActual;
          const hayCambioEstado = estadoNuevo !== estadoActual;

          if (hayCambioCantidad || hayCambioEstado) {
            detallesAActualizar.push({
              IdDetalleDevolucion: idDetalle,
              IdEquipo: Number(detActual.IdEquipo),
              IdRemision: Number(detActual.IdRemision),
              IdDetalleRemision: Number(detActual.IdDetalleRemision),
              CantidadAnterior: cantidadActual,
              Cantidad: cantidadNueva,
              IdEstado: estadoNuevo,
              DocumentoSubarrendatario:
                detActual.DocumentoSubarrendatario ||
                detNuevo.DocumentoSubarrendatario ||
                null,
            });
          }
          continue;
        }

        const idDetalleRemision = Number(detNuevo.IdDetalleRemision);
        if (!idDetalleRemision) {
          throw new Error(
            "Para agregar ítems nuevos se requiere IdDetalleRemision",
          );
        }

        const detalleRemisionDisponible =
          await ActualizarDevolucionQuery.getDetalleRemisionDisponibleParaDevolucion(
            connection,
            [
              IdDevolucion,
              idDetalleRemision,
              devolucionActual.DocumentoCliente,
              devolucionActual.IdProyecto,
            ],
          );

        if (!detalleRemisionDisponible) {
          throw new Error(
            `El detalle de remisión ${idDetalleRemision} no pertenece al cliente/proyecto de esta devolución`,
          );
        }

        const cantidadDisponible = Number(
          detalleRemisionDisponible.CantidadDisponibleParaDevolver || 0,
        );
        if (cantidadNueva > cantidadDisponible) {
          throw new Error(
            `La cantidad a devolver (${cantidadNueva}) supera lo pendiente (${cantidadDisponible}) para el detalle ${idDetalleRemision}`,
          );
        }

        const idEquipoDetalle = Number(detalleRemisionDisponible.IdEquipo);
        const idRemisionDetalle = Number(detalleRemisionDisponible.IdRemision);
        const idEquipoPayload = Number(detNuevo.IdEquipo);
        const idRemisionPayload = Number(detNuevo.IdRemision);

        if (idEquipoPayload && idEquipoPayload !== idEquipoDetalle) {
          throw new Error(
            `El equipo enviado no coincide con el detalle de remisión ${idDetalleRemision}`,
          );
        }

        if (idRemisionPayload && idRemisionPayload !== idRemisionDetalle) {
          throw new Error(
            `La remisión enviada no coincide con el detalle de remisión ${idDetalleRemision}`,
          );
        }

        detallesANuevos.push({
          IdEquipo: idEquipoDetalle,
          IdRemision: idRemisionDetalle,
          IdDetalleRemision: idDetalleRemision,
          Cantidad: cantidadNueva,
          IdEstado: estadoNuevo,
          DocumentoSubarrendatario:
            detalleRemisionDisponible.DocumentoSubarrendatario ||
            detNuevo.DocumentoSubarrendatario ||
            null,
        });
      }
    }

    for (const detActual of detallesActuales) {
      const idActual = Number(detActual.IdDetalleDevolucion);
      if (!idsDetallesPayload.has(idActual)) {
        detallesAEliminar.push({
          IdDetalleDevolucion: idActual,
          IdEquipo: Number(detActual.IdEquipo),
          CantidadAnterior: Number(detActual.Cantidad || 0),
          DocumentoSubarrendatario: detActual.DocumentoSubarrendatario || null,
        });
      }
    }

    const huboCambiosDetalles =
      detallesAActualizar.length > 0 ||
      detallesANuevos.length > 0 ||
      detallesAEliminar.length > 0;
    const huboCambios = huboCambiosCabecera || huboCambiosDetalles;

    const diffsStock = new Map();

    if (huboCambiosDetalles) {
      for (const det of detallesAActualizar) {
        const esPropio =
          det.DocumentoSubarrendatario === EmpresaAnfitriona.value;
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

      for (const det of detallesANuevos) {
        const esPropio =
          det.DocumentoSubarrendatario === EmpresaAnfitriona.value;
        if (!esPropio) {
          continue;
        }
        const idEquipo = Number(det.IdEquipo);
        diffsStock.set(
          idEquipo,
          (diffsStock.get(idEquipo) || 0) + Number(det.Cantidad),
        );
      }

      for (const det of detallesAEliminar) {
        const esPropio =
          det.DocumentoSubarrendatario === EmpresaAnfitriona.value;
        if (!esPropio) {
          continue;
        }
        const idEquipo = Number(det.IdEquipo);
        diffsStock.set(
          idEquipo,
          (diffsStock.get(idEquipo) || 0) - Number(det.CantidadAnterior || 0),
        );
      }
    }

    if (!huboCambios) {
      await connection.rollback();
      return {
        code: 204,
        success: true,
        huboCambios: false,
        message: "No se detectaron cambios en la devolución",
        detallesActualizados: [],
      };
    }

    const equiposConMovimiento = [];

    for (const [idEquipo, delta] of diffsStock.entries()) {
      if (delta === 0) {
        continue;
      }

      const equipoInfo = await ActualizarDevolucionQuery.getEquipoInfo(
        connection,
        idEquipo,
      );

      if (!equipoInfo) {
        throw new Error(`No se encontró el equipo ${idEquipo}`);
      }

      const disponible = Number(equipoInfo.CantidadDisponible || 0);

      if (delta < 0 && disponible < Math.abs(delta)) {
        throw new Error(
          `La cantidad no puede ser negativa para el equipo ${idEquipo}`,
        );
      }

      await ActualizarDevolucionQuery.updateStockEquipoConDelta(
        connection,
        [delta, delta, delta, idEquipo],
        "add",
      );

      const direccion = delta > 0 ? "ENTRADA" : "SALIDA";
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
        FechaActualColombia(),
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
        nuevoHeader.FechaDevolucion,
        nuevoHeader.IdEstado,
        IdDevolucion,
      ]);
    }

    if (huboCambiosDetalles) {
      for (const det of detallesAActualizar) {
        await ActualizarDevolucionQuery.updateDetalleDevolucion(connection, [
          det.Cantidad,
          det.IdEstado,
          det.IdDetalleDevolucion,
        ]);
      }

      for (const det of detallesANuevos) {
        await ActualizarDevolucionQuery.insertDetalleDevolucion(connection, [
          IdDevolucion,
          det.IdEquipo,
          det.Cantidad,
          det.IdEstado,
          det.IdRemision,
          det.IdDetalleRemision,
        ]);
      }

      for (const det of detallesAEliminar) {
        await ActualizarDevolucionQuery.deleteDetalleDevolucion(
          connection,
          det.IdDetalleDevolucion,
        );
      }
    }

    await connection.commit();
    await emitirWebSocketDevolucion().devolucionActualizada(IdDevolucion);
    return {
      code: 200,
      success: true,
      huboCambios: true,
      message: "Devolución actualizada correctamente",
      detallesActualizados: {
        cabecera: cambiosCabecera,
        detallesActualizados: detallesAActualizar.map(
          (det) => det.IdDetalleDevolucion,
        ),
        detallesNuevos: detallesANuevos.length,
        detallesEliminados: detallesAEliminar.map(
          (det) => det.IdDetalleDevolucion,
        ),
        equiposConMovimiento,
      },
    };
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error al actualizar la devolución: ", error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

module.exports = {
  ActualizarDevolucionService,
};
