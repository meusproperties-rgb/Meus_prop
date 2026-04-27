const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const { Client } = require('pg');
const bcrypt = require('bcryptjs');

function loadEnvFile(fileName) {
  const filePath = path.join(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) {
    return;
  }

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function loadEnv() {
  loadEnvFile('.env.local');
  loadEnvFile('.env');
}

function getConnectionConfig() {
  loadEnv();

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing. Add it to .env.local or your shell environment.');
  }

  const useSsl = !/localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL);

  return {
    connectionString: process.env.DATABASE_URL,
    ssl: useSsl ? { rejectUnauthorized: false } : false,
  };
}

async function getClient() {
  const client = new Client(getConnectionConfig());
  await client.connect();
  return client;
}

async function upsertAdmin(client, { email, password, name }) {
  const hashedPassword = await bcrypt.hash(password, 12);

  await client.query(
    `
      INSERT INTO users ("id", "name", "email", "password", "role", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, 'admin', NOW(), NOW())
      ON CONFLICT ("email")
      DO UPDATE
      SET "name" = EXCLUDED."name",
          "password" = EXCLUDED."password",
          "role" = 'admin',
          "updatedAt" = NOW()
    `,
    [randomUUID(), name, email.toLowerCase(), hashedPassword]
  );
}

module.exports = {
  getClient,
  loadEnv,
  upsertAdmin,
};
