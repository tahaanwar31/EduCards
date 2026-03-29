import dns from 'dns';
import mongoose from 'mongoose';

dns.setDefaultResultOrder('ipv4first');

/** Prefer IPv4 — some serverless ↔ Atlas routes stall on IPv6/SRV. */
const mongooseOpts: mongoose.ConnectOptions = {
  serverSelectionTimeoutMS: 8_000,
  connectTimeoutMS: 8_000,
  socketTimeoutMS: 25_000,
  maxPoolSize: 5,
  minPoolSize: 0,
  bufferCommands: false,
  family: 4,
};

declare global {
  // eslint-disable-next-line no-var -- Vercel serverless reuse
  var __mongooseServerlessPromise: Promise<typeof mongoose> | undefined;
}

function sanitizeMongoUri(raw: string): string {
  let u = raw.trim();
  if ((u.startsWith('"') && u.endsWith('"')) || (u.startsWith("'") && u.endsWith("'"))) {
    u = u.slice(1, -1);
  }
  return u.trim();
}

function withRequiredQueryParams(uri: string): string {
  if (uri.includes('retryWrites=')) return uri;
  const sep = uri.includes('?') ? '&' : '?';
  return `${uri}${sep}retryWrites=true&w=majority`;
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('MONGODB_URI is not defined. Please configure it in the Secrets panel.');
    return false;
  }
  try {
    await mongoose.connect(withRequiredQueryParams(sanitizeMongoUri(uri)), mongooseOpts);
    console.log('Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
}

const CONNECT_RACE_MS = 12_000;

async function connectOnce(uri: string): Promise<typeof mongoose> {
  const connectPromise = mongoose.connect(uri, mongooseOpts);
  const deadline = new Promise<never>((_, reject) =>
    setTimeout(
      () =>
        reject(
          new Error(
            'MongoDB connect exceeded deadline (check Atlas: cluster running, IP 0.0.0.0/0, user/password)'
          )
        ),
      CONNECT_RACE_MS
    )
  );
  try {
    await Promise.race([connectPromise, deadline]);
    return mongoose;
  } catch (e) {
    await mongoose.disconnect().catch(() => {});
    throw e;
  }
}

/** Cached connect for Vercel/serverless — hard deadline so the function cannot hang until maxDuration. */
export async function connectDBServerless(): Promise<void> {
  const raw = process.env.MONGODB_URI;
  if (!raw) throw new Error('MONGODB_URI not configured');
  const uri = withRequiredQueryParams(sanitizeMongoUri(raw));

  if (mongoose.connection.readyState === 1) return;

  if (!global.__mongooseServerlessPromise) {
    global.__mongooseServerlessPromise = connectOnce(uri);
  }
  try {
    await global.__mongooseServerlessPromise;
  } catch (err) {
    global.__mongooseServerlessPromise = undefined;
    throw err;
  }
}
