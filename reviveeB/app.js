require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/dbConfig");
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cookieParser())
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "Revive API" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Import routes
app.use("/customer", require("./routes/customerRoute"));
app.use("/inspector", require("./routes/inspectorRoute"));
app.use("/product", require("./routes/productRoute"));
app.use("/admin", require("./routes/adminRoute"));

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
