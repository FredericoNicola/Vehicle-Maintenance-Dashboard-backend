import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import vehicleRoutes from "./routes/vehicles";
import documentRoutes from "./routes/documents";
import partnerRoutes from "./routes/partners";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/auth", authRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/documents", documentRoutes);
app.use("/partners", partnerRoutes);
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
