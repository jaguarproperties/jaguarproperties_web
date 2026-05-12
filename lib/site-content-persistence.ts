import { Prisma } from "@prisma/client";

import { getMongoDb } from "@/lib/mongo";

function normalizeSiteContentData(data: Prisma.SiteContentUncheckedCreateInput) {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  ) as Prisma.SiteContentUncheckedCreateInput;
}

export async function createOrUpdateSiteContent(
  id: string,
  data: Prisma.SiteContentUncheckedCreateInput
) {
  const normalizedData = normalizeSiteContentData(data);
  const db = await getMongoDb();
  const collection = db.collection("SiteContent");
  const now = new Date();

  const existingSiteContent = await collection.findOne(
    { _id: id } as any,
    { projection: { _id: 1 } }
  );

  if (existingSiteContent) {
    await collection.updateOne(
      { _id: id } as any,
      {
        $set: {
          ...normalizedData,
          updatedAt: now
        } as Record<string, unknown>
      }
    );

    return;
  }

  await collection.insertOne({
    _id: id,
    ...normalizedData,
    createdAt: now,
    updatedAt: now
  } as Record<string, unknown>);
}
