import { Prisma } from "@prisma/client";

import { getMongoDb } from "@/lib/mongo";

type SiteContentDocument = Prisma.SiteContentUncheckedCreateInput & {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};

function normalizeSiteContentData(data: Prisma.SiteContentUncheckedCreateInput) {
  return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
}

export async function createOrUpdateSiteContent(
  id: string,
  data: Prisma.SiteContentUncheckedCreateInput
) {
  const collection = (await getMongoDb()).collection<SiteContentDocument>("SiteContent");
  const now = new Date();
  const normalizedData = normalizeSiteContentData(data);

  await collection.updateOne(
    { _id: id },
    {
      $set: {
        ...normalizedData,
        updatedAt: now
      },
      $setOnInsert: {
        _id: id,
        createdAt: now
      }
    },
    { upsert: true }
  );
}
