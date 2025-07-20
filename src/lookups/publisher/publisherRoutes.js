import express from "express";
import {
  createPublisher,
  getAllPublishers,
  getPublisherById,
  updatePublisher,
  deletePublisher,
} from "./publisherController.js";

const router = express.Router();

router.post("/", createPublisher);
router.get("/", getAllPublishers);
router.get("/:idOrAlias", getPublisherById);
router.put("/:id", updatePublisher);
router.delete("/:id", deletePublisher);

export default router;
