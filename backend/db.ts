import mongoose from 'mongoose';

const mongooseOpts = {
  serverSelectionTimeoutMS: 10_000,
  connectTimeoutMS: 10_000,
  socketTimeoutMS: 45_000,
  maxPoolSize: 10,
  bufferCommands: false,
} as const;

declare global {
  // eslint-disable-next-line no-var -- Vercel serverless reuse
  var __mongooseServerlessPromise: Promise<typeof mongoose> | undefined;
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('MONGODB_URI is not defined. Please configure it in the Secrets panel.');
    return false;
  }
  try {
    await mongoose.connect(uri, mongooseOpts);
    console.log('Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
}

/** Cached connect for Vercel/serverless — avoids hanging connections and long cold-start stalls. */
export async function connectDBServerless(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not configured');

  if (mongoose.connection.readyState === 1) return;

  if (!global.__mongooseServerlessPromise) {
    global.__mongooseServerlessPromise = mongoose.connect(uri, mongooseOpts);
  }
  try {
    await global.__mongooseServerlessPromise;
  } catch (err) {
    global.__mongooseServerlessPromise = undefined;
    throw err;
  }
}
