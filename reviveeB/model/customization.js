const mongoose = require("mongoose");

const customizationSchema = new mongoose.Schema({
    customer_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'customer', 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    project_description: { 
        type: String, 
        required: true 
    },
    preferred_material: { 
        type: String, 
        required: true 
    },
    color_finish: { 
        type: String, 
        required: true 
    },
    design_inspiration: [{
        type: String, 
        required: true
    }],
    status: {
        type: String,
        required: true,
        enum: ['pending', 'under_review', 'approved', 'rejected', 'in_progress', 'completed'],
        default: 'pending'
    },
    submission_date: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

module.exports = mongoose.model("customization", customizationSchema);
