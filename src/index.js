"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const vehicles_1 = __importDefault(require("./routes/vehicles"));
const documents_1 = __importDefault(require("./routes/documents"));
const partners_1 = __importDefault(require("./routes/partners"));
const nifs_1 = __importDefault(require("./routes/nifs")); // Add this line
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(
  "/uploads",
  express_1.default.static(path_1.default.join(__dirname, "../uploads"))
);
app.get("/", (req, res) => {
  res.send("API running");
});
app.use("/auth", auth_1.default);
app.use("/vehicles", vehicles_1.default);
app.use("/documents", documents_1.default);
app.use("/partners", partners_1.default);
app.use("/nifs", nifs_1.default); // Add this line
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
