const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    medicineName: { 
        type: String, 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true, 
        default: 1 
    },
    totalPrice: { 
        type: Number, 
        required: true 
    },
    customerName: { 
        type: String, 
        required: true 
    },
    customerEmail: { 
        type: String, 
        required: true 
    },
    date: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Order', OrderSchema);
