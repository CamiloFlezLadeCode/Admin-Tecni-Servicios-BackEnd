module.exports = [
  // Rutas login
  require('./login/loginRoute'),
  // Rutas backups
  require('./backup/crearBackupRoutes'),
  // Rutas gestion y control
  require('./gestionycontrol/cuenta/cuentaRoutes'),
  require('./gestionycontrol/clientes/clientesRoutes'),
  require('./gestionycontrol/usuarios/usuariosRoutes'),
  require('./gestionycontrol/equipos/equiposRoutes'),
  require('./gestionycontrol/mecanicos/mecanicosRoutes'),
  require('./gestionycontrol/proyectos/proyectosRoutes'),
  require('./gestionycontrol/repuestos/repuestosRoutes'),
  require('./gestionycontrol/usuariosgenerales/usuariosgeneralesRoutes'),
  require('./gestionycontrol/vehiculos/vehiculosRoutes'),
  require('./gestionycontrol/bodegas/bodegasRoutes'),
  require('./gestionycontrol/ajustes/ajustesRoutes'),
  // Rutas generales
  require('./generales/GeneralesRoutes'),
  // Rutas comercial
  require('./comercial/remisiones/remisionesRoutes'),
  require('./comercial/devoluciones/devolucionesRoutes'),
  require('./comercial/ordenes_de_servicio/ordenesDeServicioRoutes'),
  require('./comercial/estado_de_cuenta/estadoDeCuentaRoutes'),
  require('./comercial/movimientos_generales/movimientosGeneralesRoutes'),
  // Rutas configuraciones
  require('./configuraciones/configuracionesRoutes'),
  // Rutas inventario
  require('./inventario/equipos/equiposRoutes'),
  require('./inventario/repuestos/repuestosRoutes')
];