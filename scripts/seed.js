const { getClient, loadEnv, upsertAdmin } = require('./db-utils');

async function main() {
  loadEnv();

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@example.com').trim().toLowerCase();
  const adminPassword = (process.env.ADMIN_PASSWORD || 'Admin123!').trim();
  const adminName = (process.env.ADMIN_NAME || 'Administrator').trim();

  const client = await getClient();

  try {
    const tableCheck = await client.query("SELECT to_regclass('public.users') AS table_name");
    if (!tableCheck.rows[0]?.table_name) {
      console.error('The users table does not exist yet. Run npm run db:migrate first.');
      process.exit(1);
    }

    await upsertAdmin(client, {
      email: adminEmail,
      password: adminPassword,
      name: adminName,
    });

    console.log(`Seeded admin user ${adminEmail}.`);
    console.log('You can override ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_NAME in .env.local.');
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('Database seeding failed:', error);
  process.exit(1);
});
