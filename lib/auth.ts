import Credentials from "next-auth/providers/credentials";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import { z } from "zod";

import { ensureMongoConnection } from "@/lib/mongo";
import { prisma } from "@/lib/prisma";

const NEXTAUTH_SECRET =
  process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? "jaguar-default-nextauth-secret";
const DEFAULT_ROLE: UserRole = "ADMIN";

const credentialsSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(6)
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login"
  },
  trustHost: true,
  secret: NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "User ID or Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const identifier = parsed.data.identifier.trim();
        const identifierLower = identifier.toLowerCase();
        const identifierUpper = identifier.toUpperCase();

        if (!(process.env.DATABASE_DIRECT_URL || process.env.DATABASE_URL)) {
          console.error("[Auth] Login failed because DATABASE_URL is missing.", {
            identifier
          });
          return null;
        }

        try {
          await ensureMongoConnection();

          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: identifier },
                { email: identifierLower },
                { username: identifier },
                { username: identifierLower },
                { employeeCode: identifierUpper }
              ]
            }
          });

          if (!user) {
            console.error("[Auth] Login failed because no matching admin user was found in MongoDB.", {
              identifier,
              nextAuthUrl: process.env.NEXTAUTH_URL ?? null
            });
            return null;
          }

          const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
          if (!isValid) {
            console.error("[Auth] Login failed because password comparison failed.", {
              identifier,
              userId: user.id,
              username: user.username,
              email: user.email
            });
            return null;
          }

          console.log("[Auth] Login successful.", {
            identifier,
            userId: user.id,
            role: user.role
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            employeeCode: user.employeeCode,
            role: user.role
          };
        } catch (error) {
          console.error("[Auth] Database lookup failed during admin authorization.", {
            identifier,
            hasDatabaseUrl: Boolean(process.env.DATABASE_DIRECT_URL || process.env.DATABASE_URL),
            nextAuthUrl: process.env.NEXTAUTH_URL ?? null,
            error
          });
          return null;
        }
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.employeeCode = user.employeeCode;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as UserRole | undefined) ?? DEFAULT_ROLE;
        session.user.employeeCode = (token.employeeCode as string | undefined) ?? "";
      }
      return session;
    }
  }
});
