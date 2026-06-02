require('dotenv').config();

const buildConnection = (database) => {
  const password = process.env.DB_PASSWORD;
  if (!password) {
    throw new Error(
      'DB_PASSWORD is not set. Copy backend/.env.example to backend/.env and configure your database.'
    );
  }
  return {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    database,
    user: process.env.DB_USER || 'postgres',
    password
  };
};

module.exports = {
  development: {
    client: process.env.DB_CLIENT || 'pg',
    connection: buildConnection(process.env.DB_NAME || 'agri_setu_dev'),
    migrations: { directory: './migrations' },
    seeds: { directory: './seeds' },
    pool: { min: 2, max: 10 }
  },

  production: {
    client: process.env.DB_CLIENT || 'pg',
    connection: {
      ...buildConnection(process.env.DB_NAME),
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    },
    migrations: { directory: './migrations' },
    seeds: { directory: './seeds' },
    pool: { min: 2, max: 10 }
  },

  test: {
    client: process.env.DB_CLIENT || 'pg',
    connection: buildConnection(process.env.DB_NAME_TEST || 'agri_setu_test'),
    migrations: { directory: './migrations' },
    seeds: { directory: './seeds' },
    pool: { min: 2, max: 10 }
  }
};
