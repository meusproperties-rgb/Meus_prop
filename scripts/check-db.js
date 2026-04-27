const { getClient } = require('./db-utils');

async function main() {
  const client = await getClient();

  try {
    const nowResult = await client.query('SELECT NOW() AS now');
    const dbResult = await client.query('SELECT current_database() AS database_name');
    const versionResult = await client.query('SHOW server_version');

    console.log('Database connection successful.');
    console.log(`Database: ${dbResult.rows[0]?.database_name}`);
    console.log(`Server version: ${versionResult.rows[0]?.server_version}`);
    console.log(`Server time: ${nowResult.rows[0]?.now}`);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('Database connection check failed:', error);
  process.exit(1);
});
