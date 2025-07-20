import express from "express";
import { createBook, getAllBooks, getBookById, updateBook, deleteBook } from "./booksController.js";
import upload from "../../config/multer.js";

const router = express.Router();

router.post("/", upload.array("images", 5), createBook);
router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.put("/:id", upload.array("images", 5), updateBook);
router.delete("/:id", deleteBook);

export default router;
