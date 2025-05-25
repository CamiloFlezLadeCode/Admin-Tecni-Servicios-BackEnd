module.exports = [
  require('./login/loginRoute'),
  require('./usersRoutes'),
  require('./departRoutes'),
  require('./gestionycontrol/clientes/clientesRoutes'),
  require('./backup/crearBackupRoutes'),
  require('./gestionycontrol/usuarios/usuariosRoutes'),
  require('./gestionycontrol/equipos/equiposRoutes'),
  require('./gestionycontrol/mecanicos/mecanicosRoutes'),
  require('./generales/GeneralesRoutes'),
  require('./gestionycontrol/proyectos/proyectosRoutes'),
  require('./gestionycontrol/usuariosgenerales/usuariosgeneralesRoutes'),
  require('./gestionycontrol/vehiculos/vehiculosRoutes')
];