import { MongoClient, type Collection } from 'mongodb';
import type { ProgressDoc } from './types';

/**
 * MongoDB Atlas connection.
 *
 * Next.js reloads modules on every edit in development, which would otherwise
 * open a brand new connection pool each time and quickly exhaust the Atlas
 * connection limit. Caching the promise on `globalThis` keeps one pool alive
 * across reloads; in production the module is only evaluated once anyway.
 */

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? 'dsa_tracker';

/** True when an Atlas URI is configured; the API routes check this first. */
export const mongoConfigured = Boolean(uri);

/** The shape stored in Mongo: our document plus the _id we key it by. */
export type ProgressRecord = ProgressDoc & { _id: string };

const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
};

function clientPromise(): Promise<MongoClient> {
  if (!uri) throw new Error('MONGODB_URI is not set');
  if (!globalForMongo._mongoClientPromise) {
    globalForMongo._mongoClientPromise = new MongoClient(uri, {
      // Fail fast with a clear error instead of hanging if the cluster is
      // unreachable or the IP is not allow-listed in Atlas.
      serverSelectionTimeoutMS: 8000,
    }).connect();
  }
  return globalForMongo._mongoClientPromise;
}

export async function progressCollection(): Promise<Collection<ProgressRecord>> {
  const client = await clientPromise();
  return client.db(dbName).collection<ProgressRecord>('progress');
}

/** One account: keyed by lowercased email, so it doubles as the lookup key. */
export interface UserRecord {
  _id: string;
  name: string;
  /** "salt:hash" from hashPassword() in @/lib/auth -- never a plaintext password. */
  passwordHash: string;
  createdAt: string;
}

export async function usersCollection(): Promise<Collection<UserRecord>> {
  const client = await clientPromise();
  return client.db(dbName).collection<UserRecord>('users');
}
