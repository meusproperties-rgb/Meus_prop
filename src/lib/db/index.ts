import sequelize from './connection';
import User from './models/User';
import Property from './models/Property';
import { PropertyImage, Favorite, Enquiry } from './models/index';

// Associations

// User -> Properties (one-to-many)
User.hasMany(Property, { foreignKey: 'userId', as: 'properties', onDelete: 'CASCADE' });
Property.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

// Property -> Images (one-to-many)
Property.hasMany(PropertyImage, { foreignKey: 'propertyId', as: 'images', onDelete: 'CASCADE' });
PropertyImage.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });

// User <-> Properties (many-to-many via Favorites)
User.hasMany(Favorite, { foreignKey: 'userId', as: 'favorites', onDelete: 'CASCADE' });
Property.hasMany(Favorite, { foreignKey: 'propertyId', as: 'favorites', onDelete: 'CASCADE' });
Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Favorite.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });

// Property -> Enquiries (one-to-many)
Property.hasMany(Enquiry, { foreignKey: 'propertyId', as: 'enquiries', onDelete: 'CASCADE' });
Enquiry.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });

// User -> Enquiries (one-to-many, optional)
User.hasMany(Enquiry, { foreignKey: 'userId', as: 'enquiries', onDelete: 'SET NULL' });
Enquiry.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export async function initDB() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    if (process.env.DB_SYNC === 'true') {
      await sequelize.sync();
      console.log('Models synchronized via Sequelize sync');
    }
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

let dbInitPromise: Promise<void> | null = null;

export async function ensureDatabase() {
  if (!dbInitPromise) {
    dbInitPromise = initDB().catch((error) => {
      dbInitPromise = null;
      throw error;
    });
  }

  await dbInitPromise;
}

export { sequelize, User, Property, PropertyImage, Favorite, Enquiry };
