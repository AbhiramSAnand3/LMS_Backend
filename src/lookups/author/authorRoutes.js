import express from "express";
import {
  createAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
} from "./authorController.js";

const router = express.Router();

router.post("/", createAuthor);
router.get("/", getAllAuthors);
router.get("/:id", getAuthorById);
router.put("/:id", updateAuthor);
router.delete("/:id", deleteAuthor);

export default router;
