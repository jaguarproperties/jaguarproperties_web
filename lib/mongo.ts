import { MongoClient } from "mongodb";

import { getDatabaseUrl } from "@/lib/database-url";

const globalForMongo = globalThis as unknown as {
  mongoClient?: MongoClient;
  mongoConnectPromise?: Promise<MongoClient>;
  hasLoggedMongoConnection?: boolean;
};

function getMongoClient() {
  if (!globalForMongo.mongoClient) {
    globalForMongo.mongoClient = new MongoClient(getDatabaseUrl(), {
      appName: "jaguar-properties"
    });
  }

  return globalForMongo.mongoClient;
}

async function connectMongoClient() {
  if (!globalForMongo.mongoConnectPromise) {
    globalForMongo.mongoConnectPromise = getMongoClient().connect().catch((error) => {
      globalForMongo.mongoConnectPromise = undefined;
      throw error;
    });
  }

  const client = await globalForMongo.mongoConnectPromise;

  if (!globalForMongo.hasLoggedMongoConnection) {
    console.log("[MongoDB] Connected successfully.");
    globalForMongo.hasLoggedMongoConnection = true;
  }

  return client;
}

export async function getMongoDb() {
  const client = await connectMongoClient();
  return client.db();
}

export async function ensureMongoConnection() {
  await connectMongoClient();
}
