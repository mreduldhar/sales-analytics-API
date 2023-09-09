const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({

    product: { type: String, trim: true, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    date: { type: Date, default: Date.now },

    },
    { timestamps: true, versionKey: false }
);

const SalesModel = mongoose.model('sales', saleSchema);

module.exports = SalesModel;
