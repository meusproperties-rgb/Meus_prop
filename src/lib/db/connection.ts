import { Sequelize } from 'sequelize';

const DATABASE_URL = process.env.DATABASE_URL!;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

declare global {
  // eslint-disable-next-line no-var
  var sequelize: Sequelize | undefined;
}

const sequelize =
  global.sequelize ||
  new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });

if (process.env.NODE_ENV !== 'production') {
  global.sequelize = sequelize;
}

export default sequelize;
