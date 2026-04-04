import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../connection';

export type PropertyType = 'apartment' | 'villa' | 'penthouse' | 'townhouse' | 'commercial' | 'land';
export type PropertyStatus = 'for_sale' | 'for_rent' | 'sold' | 'rented';
export type PropertyFurnishing = 'furnished' | 'semi_furnished' | 'unfurnished';

export interface PropertyAttributes {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  area: number;
  bedrooms: number | null;
  bathrooms: number | null;
  parkingSpaces: number | null;
  furnishing: PropertyFurnishing | null;
  floor: number | null;
  totalFloors: number | null;
  yearBuilt: number | null;
  address: string;
  city: string;
  district: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  amenities: string[];
  features: string[];
  coverImage: string | null;
  videoUrl: string | null;
  isFeatured: boolean;
  isActive: boolean;
  viewCount: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PropertyCreationAttributes = Optional<
  PropertyAttributes,
  | 'id'
  | 'bedrooms'
  | 'bathrooms'
  | 'parkingSpaces'
  | 'furnishing'
  | 'floor'
  | 'totalFloors'
  | 'yearBuilt'
  | 'district'
  | 'latitude'
  | 'longitude'
  | 'amenities'
  | 'features'
  | 'coverImage'
  | 'videoUrl'
  | 'isFeatured'
  | 'isActive'
  | 'viewCount'
  | 'createdAt'
  | 'updatedAt'
>;

class Property
  extends Model<PropertyAttributes, PropertyCreationAttributes>
  implements PropertyAttributes
{
  declare id: string;
  declare title: string;
  declare slug: string;
  declare description: string;
  declare type: PropertyType;
  declare status: PropertyStatus;
  declare price: number;
  declare area: number;
  declare bedrooms: number | null;
  declare bathrooms: number | null;
  declare parkingSpaces: number | null;
  declare furnishing: PropertyFurnishing | null;
  declare floor: number | null;
  declare totalFloors: number | null;
  declare yearBuilt: number | null;
  declare address: string;
  declare city: string;
  declare district: string | null;
  declare country: string;
  declare latitude: number | null;
  declare longitude: number | null;
  declare amenities: string[];
  declare features: string[];
  declare coverImage: string | null;
  declare videoUrl: string | null;
  declare isFeatured: boolean;
  declare isActive: boolean;
  declare viewCount: number;
  declare userId: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Property.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: { notEmpty: true, len: [5, 200] },
    },
    slug: {
      type: DataTypes.STRING(250),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('apartment', 'villa', 'penthouse', 'townhouse', 'commercial', 'land'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('for_sale', 'for_rent', 'sold', 'rented'),
      allowNull: false,
      defaultValue: 'for_sale',
    },
    price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    area: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    bedrooms: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 0 },
    },
    bathrooms: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 0 },
    },
    parkingSpaces: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 0 },
    },
    furnishing: {
      type: DataTypes.ENUM('furnished', 'semi_furnished', 'unfurnished'),
      allowNull: true,
    },
    floor: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    totalFloors: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    yearBuilt: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Dubai',
    },
    district: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'UAE',
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    amenities: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    features: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    coverImage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    videoUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'properties',
    modelName: 'Property',
    indexes: [
      { unique: true, fields: ['slug'] },
      { fields: ['type'] },
      { fields: ['status'] },
      { fields: ['city'] },
      { fields: ['price'] },
      { fields: ['isFeatured'] },
      { fields: ['isActive'] },
      { fields: ['userId'] },
    ],
  }
);

export default Property;
