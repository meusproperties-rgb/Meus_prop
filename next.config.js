export const runtime = "nodejs"; // ✅ IMPORTANT: forces Node runtime

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SequelizeAdapter } from "@auth/sequelize-adapter";
import { Sequelize } from "sequelize";

// 👉 Initialize Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

// 👉 NextAuth config
const handler = NextAuth({
  adapter: SequelizeAdapter(sequelize),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 👉 your existing auth logic here
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };