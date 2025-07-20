import express from "express";
import {
  createGenre,
  getAllGenres,
  getGenreById,
  updateGenre,
  deleteGenre,
} from "./genreController.js";

const router = express.Router();

router.post("/", createGenre);
router.get("/", getAllGenres);
router.get("/:idOrAlias", getGenreById);
router.put("/:id", updateGenre);
router.delete("/:id", deleteGenre);

export default router;
