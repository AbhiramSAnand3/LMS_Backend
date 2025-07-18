import express from "express";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT;

export const startServer = async () =>
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
