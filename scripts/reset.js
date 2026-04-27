const { getClient } = require('./db-utils');

async function main() {
  const client = await getClient();

  try {
    await client.query('BEGIN');

    await client.query('DROP TABLE IF EXISTS favorites CASCADE;');
    await client.query('DROP TABLE IF EXISTS enquiries CASCADE;');
    await client.query('DROP TABLE IF EXISTS property_images CASCADE;');
    await client.query('DROP TABLE IF EXISTS properties CASCADE;');
    await client.query('DROP TABLE IF EXISTS users CASCADE;');

    await client.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enquiry_status_enum') THEN
          DROP TYPE enquiry_status_enum;
        END IF;
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_furnishing_enum') THEN
          DROP TYPE property_furnishing_enum;
        END IF;
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_status_enum') THEN
          DROP TYPE property_status_enum;
        END IF;
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_type_enum') THEN
          DROP TYPE property_type_enum;
        END IF;
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
          DROP TYPE user_role_enum;
        END IF;
      END $$;
    `);

    await client.query('COMMIT');
    console.log('Database schema reset successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('Database reset failed:', error);
  process.exit(1);
});
