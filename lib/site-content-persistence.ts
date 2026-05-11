import { Prisma, PrismaClient } from "@prisma/client";

const SITE_CONTENT_UPDATE_BATCH_SIZE = 20;

function chunkEntries<T>(entries: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < entries.length; index += size) {
    chunks.push(entries.slice(index, index + size));
  }

  return chunks;
}

function toSiteContentUpdateInput(
  data: Prisma.SiteContentUncheckedCreateInput
): Prisma.SiteContentUncheckedUpdateInput[] {
  const entries = Object.entries(data).filter(([, value]) => value !== undefined);

  return chunkEntries(entries, SITE_CONTENT_UPDATE_BATCH_SIZE).map((chunk) =>
    Object.fromEntries(chunk) as Prisma.SiteContentUncheckedUpdateInput
  );
}

export async function createOrUpdateSiteContent(
  prisma: PrismaClient,
  id: string,
  data: Prisma.SiteContentUncheckedCreateInput
) {
  const existing = await prisma.siteContent.findUnique({
    where: { id },
    select: { id: true }
  });

  if (!existing) {
    await prisma.siteContent.create({
      data: {
        id,
        ...data
      }
    });

    return;
  }

  const updates = toSiteContentUpdateInput(data);

  for (const update of updates) {
    await prisma.siteContent.update({
      where: { id },
      data: update
    });
  }
}
