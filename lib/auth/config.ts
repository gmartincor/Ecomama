import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { UserRole } from '@prisma/client';
import { authService } from '@/features/auth/services/authService';
import { env } from '@/lib/config/env';

const DEFAULT_REDIRECT = '/tablon';
const SIGN_IN_PAGE = '/login';

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: env.AUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const email = credentials.email as string;
          const password = credentials.password as string;

          const user = await authService.validateCredentials({ email, password });

          if (!user) {
            return null;
          }

          return user;
        } catch (error) {
          console.error('[AUTH] Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as UserRole;
      }
      if (trigger === 'update' && user) {
        token.id = user.id;
        token.role = user.role as UserRole;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}${DEFAULT_REDIRECT}`;
    },
  },
  pages: {
    signIn: SIGN_IN_PAGE,
  },
  session: {
    strategy: 'jwt',
  },
  trustHost: env.TRUST_HOST,
  debug: env.IS_DEVELOPMENT,
});
