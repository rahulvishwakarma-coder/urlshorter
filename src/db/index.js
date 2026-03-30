import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

// global cache
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (!MONGODB_URL) {
    console.error("MONGODB_URL is not defined. Please set it in your environment variables.");
    throw new Error("MONGODB_URL is not defined.");
  }

  if (cached.conn) {
    console.log("Using existing DB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URL).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  cached.conn = await cached.promise;
  console.log("New DB connection established");

  return cached.conn;
};

export default connectDB;