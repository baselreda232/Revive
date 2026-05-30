const mongoose = require("mongoose");
//mongoDB generates id by default
const inspectorSchema = new mongoose.Schema(
    {
        full_name: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone_number: {
            type: String,
            required: true,
            unique: true
        },
        national_id: {
            type: String,
            required: false,
        },

    },
//to see as an admin when it is created and updated
    { timestamps: true }
);
module.exports = mongoose.model("inspector", inspectorSchema);
