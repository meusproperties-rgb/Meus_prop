const { getClient } = require('./db-utils');

async function main() {
  const client = await getClient();

  try {
    await client.query('BEGIN');

    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
          CREATE TYPE user_role_enum AS ENUM ('user', 'admin');
        END IF;
      END $$;
    `);

    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_type_enum') THEN
          CREATE TYPE property_type_enum AS ENUM ('apartment', 'villa', 'penthouse', 'townhouse', 'commercial', 'land');
        END IF;
      END $$;
    `);

    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_status_enum') THEN
          CREATE TYPE property_status_enum AS ENUM ('for_sale', 'for_rent', 'sold', 'rented');
        END IF;
      END $$;
    `);

    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_furnishing_enum') THEN
          CREATE TYPE property_furnishing_enum AS ENUM ('furnished', 'semi_furnished', 'unfurnished');
        END IF;
      END $$;
    `);

    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enquiry_status_enum') THEN
          CREATE TYPE enquiry_status_enum AS ENUM ('pending', 'read', 'replied', 'closed');
        END IF;
      END $$;
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        "id" UUID PRIMARY KEY,
        "name" VARCHAR(100) NOT NULL,
        "email" VARCHAR(255) NOT NULL UNIQUE,
        "password" VARCHAR(255),
        "phone" VARCHAR(20),
        "avatar" TEXT,
        "role" user_role_enum NOT NULL DEFAULT 'user',
        "emailVerified" TIMESTAMPTZ,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS properties (
        "id" UUID PRIMARY KEY,
        "title" VARCHAR(200) NOT NULL,
        "slug" VARCHAR(250) NOT NULL UNIQUE,
        "description" TEXT NOT NULL,
        "type" property_type_enum NOT NULL,
        "status" property_status_enum NOT NULL DEFAULT 'for_sale',
        "price" DECIMAL(15, 2) NOT NULL,
        "area" DECIMAL(10, 2) NOT NULL,
        "bedrooms" INTEGER,
        "bathrooms" INTEGER,
        "parkingSpaces" INTEGER,
        "furnishing" property_furnishing_enum,
        "floor" INTEGER,
        "totalFloors" INTEGER,
        "yearBuilt" INTEGER,
        "address" VARCHAR(500) NOT NULL,
        "city" VARCHAR(100) NOT NULL DEFAULT 'Dubai',
        "district" VARCHAR(100),
        "country" VARCHAR(100) NOT NULL DEFAULT 'UAE',
        "latitude" DECIMAL(10, 8),
        "longitude" DECIMAL(11, 8),
        "amenities" TEXT[] NOT NULL DEFAULT '{}',
        "features" TEXT[] NOT NULL DEFAULT '{}',
        "coverImage" TEXT,
        "videoUrl" TEXT,
        "isFeatured" BOOLEAN NOT NULL DEFAULT FALSE,
        "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
        "viewCount" INTEGER NOT NULL DEFAULT 0,
        "userId" UUID NOT NULL REFERENCES users("id") ON DELETE CASCADE,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS property_images (
        "id" UUID PRIMARY KEY,
        "propertyId" UUID NOT NULL REFERENCES properties("id") ON DELETE CASCADE,
        "url" TEXT NOT NULL,
        "publicId" VARCHAR(200),
        "caption" VARCHAR(255),
        "order" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        "id" UUID PRIMARY KEY,
        "userId" UUID NOT NULL REFERENCES users("id") ON DELETE CASCADE,
        "propertyId" UUID NOT NULL REFERENCES properties("id") ON DELETE CASCADE,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT favorites_user_property_unique UNIQUE ("userId", "propertyId")
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS enquiries (
        "id" UUID PRIMARY KEY,
        "propertyId" UUID NOT NULL REFERENCES properties("id") ON DELETE CASCADE,
        "userId" UUID REFERENCES users("id") ON DELETE SET NULL,
        "name" VARCHAR(100) NOT NULL,
        "email" VARCHAR(255) NOT NULL,
        "phone" VARCHAR(20),
        "message" TEXT NOT NULL,
        "status" enquiry_status_enum NOT NULL DEFAULT 'pending',
        "adminNote" TEXT,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await client.query('CREATE INDEX IF NOT EXISTS users_role_idx ON users ("role");');
    await client.query('CREATE INDEX IF NOT EXISTS properties_type_idx ON properties ("type");');
    await client.query('CREATE INDEX IF NOT EXISTS properties_status_idx ON properties ("status");');
    await client.query('CREATE INDEX IF NOT EXISTS properties_city_idx ON properties ("city");');
    await client.query('CREATE INDEX IF NOT EXISTS properties_price_idx ON properties ("price");');
    await client.query('CREATE INDEX IF NOT EXISTS properties_is_featured_idx ON properties ("isFeatured");');
    await client.query('CREATE INDEX IF NOT EXISTS properties_is_active_idx ON properties ("isActive");');
    await client.query('CREATE INDEX IF NOT EXISTS properties_user_id_idx ON properties ("userId");');
    await client.query('CREATE INDEX IF NOT EXISTS property_images_property_id_idx ON property_images ("propertyId");');
    await client.query('CREATE INDEX IF NOT EXISTS property_images_order_idx ON property_images ("order");');
    await client.query('CREATE INDEX IF NOT EXISTS favorites_user_id_idx ON favorites ("userId");');
    await client.query('CREATE INDEX IF NOT EXISTS favorites_property_id_idx ON favorites ("propertyId");');
    await client.query('CREATE INDEX IF NOT EXISTS enquiries_property_id_idx ON enquiries ("propertyId");');
    await client.query('CREATE INDEX IF NOT EXISTS enquiries_user_id_idx ON enquiries ("userId");');
    await client.query('CREATE INDEX IF NOT EXISTS enquiries_status_idx ON enquiries ("status");');
    await client.query('CREATE INDEX IF NOT EXISTS enquiries_email_idx ON enquiries ("email");');

    await client.query('COMMIT');
    console.log('Database schema created successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('Database migration failed:', error);
  process.exit(1);
});
