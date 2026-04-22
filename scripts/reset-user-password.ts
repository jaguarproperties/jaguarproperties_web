import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const prisma = new PrismaClient();

async function main() {
  const [, , identifier, nextPassword] = process.argv;

  if (!identifier || !nextPassword) {
    console.error("Usage: npm run reset-user-password -- <username|email|employeeCode> <new-password>");
    process.exit(1);
  }

  const normalizedIdentifier = identifier.trim();
  const password = nextPassword.trim();

  if (password.length < 8) {
    console.error("Password must be at least 8 characters long.");
    process.exit(1);
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: normalizedIdentifier },
        { email: normalizedIdentifier.toLowerCase() },
        { employeeCode: normalizedIdentifier.toUpperCase() }
      ]
    },
    select: {
      id: true,
      username: true,
      email: true,
      employeeCode: true
    }
  });

  if (!user) {
    console.error(`User not found for "${normalizedIdentifier}".`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash }
  });

  console.log(
    JSON.stringify(
      {
        ok: true,
        username: user.username,
        email: user.email,
        employeeCode: user.employeeCode
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
