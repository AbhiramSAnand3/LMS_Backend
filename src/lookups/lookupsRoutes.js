import express from "express";
import authorRoutes from "./author/authorRoutes.js";

const router = express.Router();

router.use("/author", authorRoutes);

export default router;
