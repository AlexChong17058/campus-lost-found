const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const authRoutes = require("./src/routes/authRoutes");
const connectDB = require("./src/config/db");
const itemRoutes = require("./src/routes/itemRoutes");
const notFound = require("./src/middleware/notFound");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();

// Security headers
// Use Helmet, but disable the strict Content Security Policy for now
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Rate limit (basic protection)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Parse JSON + form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors());

// API routes
app.use("/api/items", itemRoutes);

app.use("/api/auth", authRoutes);

// Default route -> Login page (must come BEFORE express.static)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "public", "auth", "login.html"));
});

// Serve frontend
app.use(express.static(path.join(__dirname, "src", "public")));

// 404 + error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Start after DB connects
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect DB:", err.message);
    process.exit(1);
  });