import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { ensureDatabase, User } from '@/lib/db/index';

const TEMP_ADMIN_ID = 'temp-admin';
const TEMP_ADMIN_EMAIL = process.env.ADMIN_LOGIN_EMAIL || 'admin@meus.ae';
const TEMP_ADMIN_PASSWORD = process.env.ADMIN_LOGIN_PASSWORD || 'Admin@12345';
const TEMP_ADMIN_NAME = process.env.ADMIN_LOGIN_NAME || 'Admin User';
const AUTH_SECRET = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        const email = credentials.email.toLowerCase();

        if (email === TEMP_ADMIN_EMAIL.toLowerCase() && credentials.password === TEMP_ADMIN_PASSWORD) {
          return {
            id: TEMP_ADMIN_ID,
            name: TEMP_ADMIN_NAME,
            email: TEMP_ADMIN_EMAIL,
            image: null,
            role: 'admin',
          };
        }

        await ensureDatabase();

        const user = await User.findOne({
          where: { email },
        });

        if (!user) {
          throw new Error('No account found with this email');
        }

        if (!user.password) {
          throw new Error('Please sign in with Google');
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) {
          throw new Error('Invalid password');
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatar,
          role: user.role,
        };
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Handle Google OAuth sign-in
      if (account?.provider === 'google' && user.email) {
        try {
          await ensureDatabase();

          const existingUser = await User.findOne({
            where: { email: user.email },
          });

          if (!existingUser) {
            await User.create({
              name: user.name || 'User',
              email: user.email,
              password: null,
              avatar: user.image || null,
              role: 'user',
              emailVerified: new Date(),
            });
          }
        } catch (error) {
          console.error('Google sign-in error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || 'user';
      }

      if (trigger === 'update' && session?.user) {
        token.name = session.user.name;
        token.image = session.user.image;
      }

      // Refresh user data from DB on each token refresh
      if (token.id && !user && token.id !== TEMP_ADMIN_ID) {
        try {
          await ensureDatabase();

          const dbUser = await User.findByPk(token.id as string);
          if (dbUser) {
            token.role = dbUser.role;
            token.name = dbUser.name;
            token.picture = dbUser.avatar;
          }
        } catch {
          // Ignore DB errors during token refresh
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: AUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

// Extend next-auth types
declare module 'next-auth' {
  interface User {
    id: string;
    role: string;
  }
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
      role: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
  }
}
