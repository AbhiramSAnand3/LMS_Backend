import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import createDefaultAdmin from "./src/modules/admin-module/adminController.js";
import routes from "./src/routes/index.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(join(__dirname, "./src/uploads/")));

// Routes
app.use("/api", routes);

const server = async () =>
  app.listen(process.env.PORT, () =>
    console.log(`Server listening on port ${process.env.PORT}`),
  );

const startApp = async () => {
  server();
  await connectDB();
  await createDefaultAdmin();
};

startApp();

export default app;
