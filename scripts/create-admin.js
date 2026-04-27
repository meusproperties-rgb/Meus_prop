const { getClient, upsertAdmin } = require('./db-utils');

async function main() {
  const [, , emailArg, passwordArg, ...nameParts] = process.argv;
  const email = emailArg?.trim().toLowerCase();
  const password = passwordArg?.trim();
  const name = nameParts.join(' ').trim() || 'Administrator';

  if (!email || !password) {
    console.error('Usage: npm run db:create-admin -- admin@example.com StrongPassword123 Admin Name');
    process.exit(1);
  }

  const client = await getClient();

  try {
    const tableCheck = await client.query("SELECT to_regclass('public.users') AS table_name");
    if (!tableCheck.rows[0]?.table_name) {
      console.error('The users table does not exist yet. Run npm run db:migrate first.');
      process.exit(1);
    }

    await upsertAdmin(client, { email, password, name });
    console.log(`Admin access is ready for ${email}.`);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('Admin creation failed:', error);
  process.exit(1);
});
