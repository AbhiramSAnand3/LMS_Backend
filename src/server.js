import express from "express";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT

const app = express();

export const startServer = async() => app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));