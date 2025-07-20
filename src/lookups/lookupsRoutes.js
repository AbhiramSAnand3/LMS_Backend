import express from "express";
import authorRoutes from "./author/authorRoutes.js";
import categoryRoutes from "./category/categoryRoutes.js";
import genreRoutes from "./genre/genreRoutes.js";
import publisherRoutes from "./publisher/publisherRoutes.js";

const router = express.Router();

router.use("/author", authorRoutes);
router.use("/category", categoryRoutes);
router.use("/genre", genreRoutes);
router.use("/publisher", publisherRoutes);

export default router;
