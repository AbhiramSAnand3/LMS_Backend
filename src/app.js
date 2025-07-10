import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"
import readersRoutes from "./modules/readers-module/readersRoutes.js"
import booksRoutes from "./modules/books-module/booksRoutes.js"
import adminRouter from "./modules/admin-module/adminRoutes.js"

dotenv.config()

const app = express()

const PORT = process.env.PORT


// Middlewares
app.use(express.json())
app.use(cors())

// Routes
app.use("/api/readers", readersRoutes)
app.use("/api/books", booksRoutes)

// DB connection
connectDB()

// Server

const startApp = () => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

startApp()


