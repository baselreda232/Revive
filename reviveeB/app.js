const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/dbConfig");
const PORT = process.env.PORT;

//calling the function
connectDB();

// Middleware
app.use(cookieParser())
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Import routes
app.use("/customer", require("./routes/customerRoute"));
app.use("/inspector", require("./routes/inspectorRoute"));
app.use("/product", require("./routes/productRoute"));
app.use("/admin", require("./routes/adminRoute"));

//connecting DB and handling port
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
mongoose.connection.on("error", (err) => {
  console.log(err);
});