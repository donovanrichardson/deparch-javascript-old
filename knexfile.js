// Update with your config settings.

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: process.env.DEVDB,
      user:     process.env.DEVUSER,
      password: process.env.DEVPW
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    debug: true,
  },

  // staging: {
  //   client: 'postgresql',
  //   connection: {
  //     database: 'my_db',
  //     user:     'username',
  //     password: 'password'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // },

  production: {
    client: 'postgresql',
    connection: {
      host:     process.env.PRODHOST,
      database: process.env.PRODDB,
      user:     process.env.PRODUSER,
      password: process.env.PRODPW
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
