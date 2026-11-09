import { MongoClient } from "mongodb";
const globalClient = globalThis as typeof globalThis & { mongoPromise?: Promise<MongoClient> };
export function mongoClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured");
  if (!globalClient.mongoPromise) {
    globalClient.mongoPromise = new MongoClient(uri, { serverSelectionTimeoutMS: 7000 })
      .connect().catch(err => { globalClient.mongoPromise = undefined; throw err; });
  }
  return globalClient.mongoPromise;
}
export async function mentorCollection() {
  const client = await mongoClient();
  return client.db(process.env.MONGODB_DB || "skillsync_nosql").collection("mentor_feedback");
}
