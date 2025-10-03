import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { UserRole } from '@prisma/client';
import { authService } from '@/features/auth/services/authService';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error('[AUTH] Missing credentials');
            return null;
          }

          const email = credentials.email as string;
          const password = credentials.password as string;

          console.log('[AUTH] Attempting login for:', email);

          const user = await authService.validateCredentials({ email, password });

          if (!user) {
            console.error('[AUTH] Authentication failed for:', email);
            return null;
          }

          console.log('[AUTH] Login successful for:', email, 'Role:', user.role);

          return user;
        } catch (error) {
          console.error('[AUTH] Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as UserRole;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  trustHost: true,
  debug: process.env.NODE_ENV === 'development',
});
