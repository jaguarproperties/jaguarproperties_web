import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const prisma = new PrismaClient();
const DEFAULT_SUPER_ADMIN_EMPLOYEE_CODE = "JP2026SA0001";
const LEGACY_ADMIN_USERNAME = "jaguarproperties2023";
const LEGACY_ADMIN_EMAIL = "admin@jaguarproperties.in";

async function main() {
  const username = process.env.SUPER_ADMIN_USERNAME ?? process.env.ADMIN_USERNAME ?? "jaguaradmin";
  const email = process.env.SUPER_ADMIN_EMAIL ?? process.env.ADMIN_EMAIL ?? "admin@jaguarproperties.in";
  const password = process.env.SUPER_ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD ?? "Jaguar2023@";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.role.upsert({
    where: { name: "SUPER_ADMIN" },
    update: {
      description: "System super administrator"
    },
    create: {
      name: "SUPER_ADMIN",
      description: "System super administrator"
    }
  });

  const usernames = Array.from(new Set([username, LEGACY_ADMIN_USERNAME]));
  const emails = Array.from(new Set([email, LEGACY_ADMIN_EMAIL]));

  const matchingUsers = await prisma.user.findMany({
    where: {
      OR: [
        { employeeCode: DEFAULT_SUPER_ADMIN_EMPLOYEE_CODE },
        { username: { in: usernames } },
        { email: { in: emails } }
      ]
    },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      username: true,
      email: true,
      employeeCode: true
    }
  });

  const primaryUser =
    matchingUsers.find((user) => user.username === username) ??
    matchingUsers.find((user) => user.email === email) ??
    matchingUsers[0];

  if (!primaryUser) {
    const created = await prisma.user.create({
      data: {
        username,
        employeeCode: DEFAULT_SUPER_ADMIN_EMPLOYEE_CODE,
        email,
        passwordHash,
        role: "SUPER_ADMIN",
        name: "Jaguar Super Admin",
        department: "Administration",
        defaultWorkType: "OFFICE",
        casualLeaveBalance: 0,
        sickLeaveBalance: 0,
        paidLeaveBalance: 24,
        unpaidLeaveBalance: 0
      },
      select: {
        id: true,
        username: true,
        email: true,
        employeeCode: true,
        role: true
      }
    });

    console.log(JSON.stringify({ ok: true, action: "created", user: created }, null, 2));
    return;
  }

  await prisma.user.update({
    where: { id: primaryUser.id },
    data: {
      username,
      email,
      employeeCode: DEFAULT_SUPER_ADMIN_EMPLOYEE_CODE,
      passwordHash,
      role: "SUPER_ADMIN",
      name: "Jaguar Super Admin",
      department: "Administration"
    }
  });

  const duplicateUserIds = matchingUsers.filter((user) => user.id !== primaryUser.id).map((user) => user.id);
  if (duplicateUserIds.length > 0) {
    await prisma.user.deleteMany({
      where: {
        id: { in: duplicateUserIds }
      }
    });
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        action: "updated",
        user: {
          id: primaryUser.id,
          username,
          email,
          employeeCode: DEFAULT_SUPER_ADMIN_EMPLOYEE_CODE,
          role: "SUPER_ADMIN"
        },
        removedDuplicates: duplicateUserIds.length
      },
      null,
      2
    )
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
