const mongoose = require("mongoose");

const connectDB = async () => {
	if (!process.env.DATABASE_URI) {
		throw new Error("DATABASE_URI is required");
	}

	await mongoose.connect(process.env.DATABASE_URI);
	console.log("Connected to MongoDB");
};

module.exports = connectDB;
