import express from "express";
import authorRoutes from "./author/authorRoutes.js";
import categoryRoutes from "./category/categoryRoutes.js";
import genreRoutes from "./genre/genreRoutes.js";

const router = express.Router();

router.use("/author", authorRoutes);
router.use("/category", categoryRoutes);
router.use("/genre", genreRoutes);


export default router;
