const mongoose = require("mongoose");

const innovationSchema = new mongoose.Schema({
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
    innovation_level: { 
        type: String, 
        required: true,
        enum: ['basic', 'intermediate', 'advanced']
    },
    approval_visit_date: { 
        type: Date, 
        required: true 
    },
    address: {
        street: { 
            type: String, 
            required: true 
        },
        city: { 
            type: String, 
            required: true 
        },
        state: { 
            type: String, 
            required: true 
        }
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'scheduled', 'approved', 'rejected', 'completed', 'cancelled'],
        default: 'pending'
    },
    submission_date: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

module.exports = mongoose.model("innovation", innovationSchema);
