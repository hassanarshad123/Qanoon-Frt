import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getSQL } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const sql = getSQL();
        const rows = await sql`
          SELECT id, email, password_hash, name, role, onboarding_completed, is_active
          FROM users WHERE email = ${credentials.email as string}
        `;

        const user = rows[0];
        if (!user) return null;
        if (!user.is_active) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password_hash
        );
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          onboardingCompleted: user.onboarding_completed,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
        token.onboardingCompleted = user.onboardingCompleted;
      }
      // Allow session updates (e.g., after onboarding completion)
      if (trigger === "update" && session) {
        if (session.role !== undefined) token.role = session.role;
        if (session.onboardingCompleted !== undefined)
          token.onboardingCompleted = session.onboardingCompleted;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.onboardingCompleted = token.onboardingCompleted;
      return session;
    },
  },
});
