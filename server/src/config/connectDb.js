import mongoose from "mongoose";

let connectionPromise;

export const connectDb = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing. Add it to server/.env.");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(mongoUri).then((connection) => {
      console.log("MongoDB connected");
      return connection;
    });

    connectionPromise.catch(() => {
      connectionPromise = undefined;
    });
  }

  return connectionPromise;
};
