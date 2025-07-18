import express from "express";
import adminRoutes from "../modules/auth-module/authRoutes.js";
import readersRoutes from "../modules/readers-module/readersRoutes.js";
import booksRoutes from "../modules/books-module/booksRoutes.js";
import lookupsRoutes from "../lookups/lookupsRoutes.js";

const router = express.Router();

router.use("/auth", adminRoutes);
router.use("/readers", readersRoutes);
router.use("/books", booksRoutes);
router.use("/lookups", lookupsRoutes);

export default router;
