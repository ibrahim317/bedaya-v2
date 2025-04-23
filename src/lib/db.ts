import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bedaya';

interface GlobalWithMongoose {
  mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Add mongoose to the global object in development
const global = globalThis as unknown as GlobalWithMongoose;

// Initialize connection state
global.mongoose = {
  conn: null,
  promise: null,
};

/**
 * Connect to MongoDB
 */
export async function connectToDatabase() {
  // Return existing connection if already established
  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  // Create new connection if one doesn't exist
  if (!global.mongoose.promise) {
    const options = {
      bufferCommands: false,
    };

    global.mongoose.promise = mongoose.connect(MONGODB_URI, options);
  }

  try {
    global.mongoose.conn = await global.mongoose.promise;
    return global.mongoose.conn;
  } catch (error) {
    global.mongoose.promise = null;
    throw error;
  }
} 