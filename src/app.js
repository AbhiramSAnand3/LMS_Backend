import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"
import readersRoutes from "./modules/readers-module/readersRoutes.js"
import booksRoutes from "./modules/books-module/booksRoutes.js"
import createDefaultAdmin from "./modules/admin-module/adminController.js"
import adminRoutes from "./modules/auth-module/authRoutes.js"
import { startServer } from "./server.js"

dotenv.config()

const app = express()

const PORT = process.env.PORT


// Middlewares
app.use(express.json())
app.use(cors())

// Routes
app.use("/api/auth", adminRoutes)
app.use("/api/readers", readersRoutes)
app.use("/api/books", booksRoutes)


const startApp = async () => {
    await startServer();
    await connectDB();
    await createDefaultAdmin();
}

startApp()


