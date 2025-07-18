import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import readersRoutes from "./modules/readers-module/readersRoutes.js";
import booksRoutes from "./modules/books-module/booksRoutes.js";
import createDefaultAdmin from "./modules/admin-module/adminController.js";
import adminRoutes from "./modules/auth-module/authRoutes.js";
import lookupsRoutes from "./lookups/lookupsRoutes.js";
import routes from "./routes/index.js";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

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
