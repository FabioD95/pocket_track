import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoMemoryServer: MongoMemoryServer;

const connectDB = async () => {
  try {
    console.log("NODE_ENV", process.env.NODE_ENV);
    if (process.env.NODE_ENV === "dev") {
      await mongoose.connect(process.env.MONGO_URI as string);
      console.log("MongoDB connected in dev mode");
    }
    if (process.env.NODE_ENV === "test") {
      mongoMemoryServer = await MongoMemoryServer.create();
      const uri = mongoMemoryServer.getUri();
      await mongoose.connect(uri, { dbName: "testDB" });
      console.log("MongoDB connected in test mode");
    } else {
      console.error("Invalid NODE_ENV");
      process.exit(1);
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;

export const disconnectDB = async () => {
  if (process.env.NODE_ENV === "test") {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoMemoryServer.stop();
  } else {
    console.error("Invalid NODE_ENV");
    process.exit(1);
  }
};
