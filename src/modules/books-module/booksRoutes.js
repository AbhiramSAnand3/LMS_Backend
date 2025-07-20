import express from "express";
import { createBook } from "./booksController.js";
import upload from "../../config/multer.js";

const router = express.Router();

router.post("/", upload.array("images", 5), createBook);

export default router;
