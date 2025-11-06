import path from "path";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import vehicleRoutes from "./routes/vehicles";
import documentRoutes from "./routes/documents";
import partnerRoutes from "./routes/partners";
import nifsRoutes from "./routes/nifs"; // Add this line
import maintenanceRoutes from "./routes/maintenance";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/auth", authRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/documents", documentRoutes);
app.use("/partners", partnerRoutes);
app.use("/nifs", nifsRoutes); // Add this line
app.use("/maintenance", maintenanceRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
