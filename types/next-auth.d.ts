import { DefaultSession } from "next-auth";
import { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: UserRole;
      employeeCode: string;
    };
  }

  interface User {
    role?: UserRole;
    employeeCode?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    employeeCode?: string;
  }
}
