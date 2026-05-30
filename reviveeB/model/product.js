const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
		},
		price: {
			type: Number,
			required: true,
		},
        description: {
            type: String,
            required: true
        },
		color: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		image:{
			type: String,
			required: true,
		}
	},
	{ timestamps: true }
);
module.exports = mongoose.model("product", productSchema);
