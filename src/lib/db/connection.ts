import { Sequelize } from 'sequelize';

const DATABASE_URL = process.env.DATABASE_URL;
const FALLBACK_DATABASE_URL = 'postgres://postgres:postgres@127.0.0.1:5432/postgres';
let hasWarnedAboutMissingDatabaseUrl = false;

function shouldUseSsl(connectionString: string) {
  const sslMode = process.env.DB_SSL?.toLowerCase();

  if (sslMode === 'false' || sslMode === 'disable' || sslMode === 'off') {
    return false;
  }

  if (sslMode === 'true' || sslMode === 'require' || sslMode === 'on') {
    return true;
  }

  return !/localhost|127\.0\.0\.1/.test(connectionString);
}

const connectionString = DATABASE_URL ?? FALLBACK_DATABASE_URL;
const useSsl = shouldUseSsl(connectionString);

declare global {
  // eslint-disable-next-line no-var
  var sequelize: Sequelize | undefined;
}

const sequelize =
  global.sequelize ||
  new Sequelize(connectionString, {
    dialect: 'postgres',
    dialectOptions: useSsl
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });

sequelize.addHook('beforeConnect', () => {
  if (!process.env.DATABASE_URL) {
    if (!hasWarnedAboutMissingDatabaseUrl) {
      console.warn('DATABASE_URL environment variable is not set; database access is unavailable.');
      hasWarnedAboutMissingDatabaseUrl = true;
    }

    throw new Error('DATABASE_URL environment variable is not set');
  }
});

if (process.env.NODE_ENV !== 'production') {
  global.sequelize = sequelize;
}

export default sequelize;
