const mongoose = require("mongoose");
//mongoDB generates id by default
const addressSchema = new mongoose.Schema({
	street: { type: String, required: true },
	city: { type: String, required: true },
	state: { type: String, required: true },
	country: { type: String, required: true, default: "Egypt" },
	is_default: { type: Boolean, default: false }
}, { _id: true });

const cartItemSchema = new mongoose.Schema({
	product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
	quantity: { type: Number, required: true, min: 1, default: 1 }
}, { _id: true });

const customerSchema = new mongoose.Schema(
	{
		full_name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		phone_number: {
			type: String,
			required: true,
		},
		addresses: [addressSchema],
		cart: [cartItemSchema]
	},
//to see as an admin when it is created and updated
	{ timestamps: true }
);
module.exports = mongoose.model("customer", customerSchema);
