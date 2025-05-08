require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
// const errorMiddleware = require('./middleware/errorMiddleware'); // Uncomment later

// Initialize express app
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded request bodies

// API Routes
app.get("/", (req, res) => {
  res.send("AI Journal Backend Running");
});

// Mount auth routes
app.use("/api/auth", require("./routes/authRoutes"));

// Mount chat routes
app.use("/api/chat", require("./routes/chatRoutes"));

// TODO: Centralized Error Handling (Uncomment later)
// app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
