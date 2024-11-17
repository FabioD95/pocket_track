import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // console.log("NODE_ENV", process.env.NODE_ENV);
    if (process.env.NODE_ENV === "dev") {
      await mongoose.connect(process.env.MONGO_URI as string);
      console.log("MongoDB connected");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
