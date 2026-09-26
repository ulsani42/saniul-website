import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

interface MongoCache {
  client: MongoClient | null;
  db: Db | null;
  promise: Promise<{ client: MongoClient; db: Db }> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoCache: MongoCache | undefined;
}

const cached: MongoCache = global._mongoCache || {
  client: null,
  db: null,
  promise: null,
};

if (!global._mongoCache) {
  global._mongoCache = cached;
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cached.client && cached.db) {
    return { client: cached.client, db: cached.db };
  }

  if (!cached.promise) {
    const client = new MongoClient(MONGODB_URI!);
    cached.promise = client.connect().then((client) => {
      const db = client.db("sani-ul-website");
      cached.client = client;
      cached.db = db;
      return { client, db };
    });
  }

  return cached.promise;
}

export async function getDb(): Promise<Db> {
  const { db } = await connectToDatabase();
  return db;
}
