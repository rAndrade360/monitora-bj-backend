// Update with your config settings.
const path = require('path');
require('dotenv').config();

module.exports = {
  development: {
    client: process.env.DBCLIENT,
    connection: {
      host: process.env.DBHOST,
      port: process.env.DBPORT,
      database: process.env.DATABASE,
      user: process.env.DBUSERNAME,
      password: process.env.DBPASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
    },
    seeds: {
      directory: path.resolve(__dirname, 'src', 'database', 'seeds'),
    },
  },

  staging: {
    client: process.env.DBCLIENT,
    connection: {
      database: process.env.DATABASE,
      user: process.env.DBUSERNAME,
      password: process.env.DBPASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: process.env.DBCLIENT,
    connection: {
      host: process.env.DBHOST,
      port: process.env.DBPORT,
      database: process.env.DATABASE,
      user: process.env.DBUSERNAME,
      password: process.env.DBPASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
    },
    seeds: {
      directory: path.resolve(__dirname, 'src', 'database', 'seeds'),
    },
  },
};
