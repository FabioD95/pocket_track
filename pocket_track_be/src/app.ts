import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import tagRoutes from "./routes/tagRoutes";

dotenv.config();
if (process.env.NODE_ENV !== "test") {
  connectDB(); // Avvia la connessione solo se non sei in ambiente di test
}

const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Consenti richieste dal frontend
    methods: "GET,POST,PUT,DELETE", // Specifica i metodi consentiti
    allowedHeaders: "Content-Type,Authorization", // Specifica gli header consentiti
  })
);

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tags", tagRoutes);

app.get("/api", (req, res) => {
  res.send("Hello from Pocket Track App!");
});

export default app;
