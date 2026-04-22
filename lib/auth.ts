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

function getEnvAdminUser(identifier: string, password: string) {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminEmail || !adminPassword) {
    return null;
  }

  const normalizedIdentifier = identifier.trim();
  const normalizedIdentifierLower = normalizedIdentifier.toLowerCase();
  const normalizedAdminUsername = adminUsername.trim().toLowerCase();
  const normalizedAdminEmail = adminEmail.trim().toLowerCase();

  if (
    (
      normalizedIdentifierLower === normalizedAdminUsername ||
      normalizedIdentifierLower === normalizedAdminEmail
    ) &&
    password === adminPassword
  ) {
    return {
      id: "demo-admin",
      email: adminEmail,
      name: "Jaguar Admin",
      employeeCode: "JP2026A0001",
      role: DEFAULT_ROLE
    };
  }

  return null;
}

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
        const envAdminUser = getEnvAdminUser(identifier, parsed.data.password);

        if (!process.env.DATABASE_URL) {
          if (!envAdminUser) {
            console.error("[Auth] Login failed because DATABASE_URL is missing and fallback admin env credentials are not configured.", {
              identifier,
              hasAdminUsername: Boolean(process.env.ADMIN_USERNAME),
              hasAdminEmail: Boolean(process.env.ADMIN_EMAIL),
              hasAdminPassword: Boolean(process.env.ADMIN_PASSWORD)
            });
          }
          return envAdminUser;
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
            if (!envAdminUser) {
              console.error("[Auth] Login failed because no matching admin user was found in MongoDB and env fallback credentials did not match.", {
                identifier,
                nextAuthUrl: process.env.NEXTAUTH_URL ?? null
              });
            }
            return envAdminUser;
          }

          const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
          if (!isValid) {
            if (!envAdminUser) {
              console.error("[Auth] Login failed because password comparison failed.", {
                identifier,
                userId: user.id,
                username: user.username,
                email: user.email
              });
            }
            return envAdminUser;
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
            hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
            nextAuthUrl: process.env.NEXTAUTH_URL ?? null,
            hasAdminFallback:
              Boolean(process.env.ADMIN_USERNAME) &&
              Boolean(process.env.ADMIN_EMAIL) &&
              Boolean(process.env.ADMIN_PASSWORD),
            error
          });
          return envAdminUser;
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
