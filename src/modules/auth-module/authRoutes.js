import express from "express";
import { AdminLogin } from "./authController.js";

const router = express.Router();

router.post("/login", AdminLogin);

export default router;
