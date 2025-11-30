const { FechaActualColombia } = require('../../utils/FechaActualColombia');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  /**
   * Ejemplo para eliminar un registro con condicón where
   */
  // await knex('municipio').where('Codigo', '05896').del() 

  /**
   * Se inserta el usuario principal del sistema
   */
  await knex('usuario').insert([
    {
      DocumentoUsuario: '901893972-3',
      TipoDocumento: 4,
      Nombres: 'TECNISERVICIOS J.F',
      Apellidos: 'S.A.S',
      Correo: 'tecniserviciossas2024@gmail.com',
      Direccion: 'CRA 36 # 42-42 EL SALVADOR',
      Telefono: '',
      Celular1: '3016184573',
      Celular2: '3228376688',
      Contacto: '',
      UsuarioCreacion: '901893972-3',
      FechaCreacion: FechaActualColombia(),
      IdEstado: 1
    }
  ]);

  /**
   * Se inserta nivel del usuario principal
   */
  await knex('usuario_niveles').insert([
    {
      DocumentoUsuario: '901893972-3',
      IdNivel: 1,
    }
  ]);

  /**
   * Se inserta el rol del usuario principal
   */
  await knex('usuario_roles').insert([
    {
      DocumentoUsuario: '901893972-3',
      IdRol: 1,
    },
    {
      DocumentoUsuario: '901893972-3',
      IdRol: 9,
    }
  ]);

  /**
   * Se insertan las credenciales del usuario principal
   */
  await knex('credenciales').insert([
    {
      DocumentoUsuario: '901893972-3',
      NombreUsuario: '901893972-3',
      ClaveUsuario: '$argon2id$v=19$m=102400,t=3,p=1$cHFuAMZ5ggBEJjNwcZM9UA$heAL7dz1tiz6ZJ8aQw7Tikv4svHZEskhuvF15HzG1e8',
      UsuarioCreacion: '901893972-3',
      FechaCreacion: FechaActualColombia()
    }
  ])
};
