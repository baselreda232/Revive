const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
    product_title: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unit_price: { type: Number, required: true, min: 0 },
    item_total: { type: Number, required: true, min: 0 }
}, { _id: true });

const orderSchema = new mongoose.Schema({
    customer_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'customer', 
        required: true 
    },
    items: [orderItemSchema],
    shipping_address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true, default: "Egypt" }
    },
    payment_method: {
        type: String,
        required: true,
        enum: ['cash', 'instapay']
    },
    pricing: {
        subtotal: { type: Number, required: true, min: 0 },
        shipping_fee: { type: Number, required: true, default: 50 },
        total: { type: Number, required: true, min: 0 }
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    order_date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("order", orderSchema);
