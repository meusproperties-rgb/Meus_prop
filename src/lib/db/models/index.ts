import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../connection';

// ─── PropertyImage ──────────────────────────────────────────────────────────

export interface PropertyImageAttributes {
  id: string;
  propertyId: string;
  url: string;
  publicId: string | null;
  caption: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type PropertyImageCreationAttributes = Optional<
  PropertyImageAttributes,
  'id' | 'publicId' | 'caption' | 'order' | 'createdAt' | 'updatedAt'
>;

export class PropertyImage
  extends Model<PropertyImageAttributes, PropertyImageCreationAttributes>
  implements PropertyImageAttributes
{
  declare id: string;
  declare propertyId: string;
  declare url: string;
  declare publicId: string | null;
  declare caption: string | null;
  declare order: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

PropertyImage.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    propertyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'properties', key: 'id' },
    },
    url: { type: DataTypes.TEXT, allowNull: false },
    publicId: { type: DataTypes.STRING(200), allowNull: true },
    caption: { type: DataTypes.STRING(255), allowNull: true },
    order: { type: DataTypes.INTEGER, defaultValue: 0 },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
  },
  {
    sequelize,
    tableName: 'property_images',
    modelName: 'PropertyImage',
    indexes: [
      { fields: ['propertyId'] },
      { fields: ['order'] },
    ],
  }
);

// ─── Favorite ────────────────────────────────────────────────────────────────

export interface FavoriteAttributes {
  id: string;
  userId: string;
  propertyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type FavoriteCreationAttributes = Optional<
  FavoriteAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

export class Favorite
  extends Model<FavoriteAttributes, FavoriteCreationAttributes>
  implements FavoriteAttributes
{
  declare id: string;
  declare userId: string;
  declare propertyId: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Favorite.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    propertyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'properties', key: 'id' },
    },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
  },
  {
    sequelize,
    tableName: 'favorites',
    modelName: 'Favorite',
    indexes: [
      { unique: true, fields: ['userId', 'propertyId'] },
      { fields: ['userId'] },
      { fields: ['propertyId'] },
    ],
  }
);

// ─── Enquiry ─────────────────────────────────────────────────────────────────

export type EnquiryStatus = 'pending' | 'read' | 'replied' | 'closed';

export interface EnquiryAttributes {
  id: string;
  propertyId: string;
  userId: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: EnquiryStatus;
  adminNote: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type EnquiryCreationAttributes = Optional<
  EnquiryAttributes,
  'id' | 'userId' | 'phone' | 'status' | 'adminNote' | 'createdAt' | 'updatedAt'
>;

export class Enquiry
  extends Model<EnquiryAttributes, EnquiryCreationAttributes>
  implements EnquiryAttributes
{
  declare id: string;
  declare propertyId: string;
  declare userId: string | null;
  declare name: string;
  declare email: string;
  declare phone: string | null;
  declare message: string;
  declare status: EnquiryStatus;
  declare adminNote: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Enquiry.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    propertyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'properties', key: 'id' },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, validate: { isEmail: true } },
    phone: { type: DataTypes.STRING(20), allowNull: true },
    message: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM('pending', 'read', 'replied', 'closed'),
      defaultValue: 'pending',
    },
    adminNote: { type: DataTypes.TEXT, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
  },
  {
    sequelize,
    tableName: 'enquiries',
    modelName: 'Enquiry',
    indexes: [
      { fields: ['propertyId'] },
      { fields: ['userId'] },
      { fields: ['status'] },
      { fields: ['email'] },
    ],
  }
);
