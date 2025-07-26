import express from "express";
import {
  createReaders,
  deleteReader,
  getAllReaders,
  getReaderById,
  updateReader,
} from "./readersController.js";

const router = express.Router();

router.post("/", createReaders);
router.get("/", getAllReaders);
router.get("/:id", getReaderById);
router.put("/:id", updateReader);
router.delete("/:id", deleteReader);

export default router;
