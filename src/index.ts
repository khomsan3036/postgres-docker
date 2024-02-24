import express from "express"

// สร้าง express app
const app = express()

// Express middleware parse json
app.use(express.json())

// Import user routes
import userRoutes from "./routes/userRoutes"

// Use user routes
app.use("/users", userRoutes)

// Start server
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})