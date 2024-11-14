import express, { Application } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";

dotenv.config();
connectDB();

const app: Application = express();

app.use(express.json());
app.use("/api/users", userRoutes);

app.get("/api", (req, res) => {
  res.send("Hello from Pocket Track App!");
});

export default app;
