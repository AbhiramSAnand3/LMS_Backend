import express from "express";
import { createGenre } from "./genreController.js";

const router = express.Router();

router.post("/", createGenre);

export default router;