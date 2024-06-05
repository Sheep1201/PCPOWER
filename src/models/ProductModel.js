const mongoose = require('mongoose')
const productSchema = new mongoose.Schema(
    {
        name: {type: String, require: true, unique: true},
        image: {type: String, require: true},
        type: {type: String, require: true},
        price: {type: Number, require: true},
        countInStock: {type: Number, require: true},
        description: {type: String, require: true},
        priceSale: {type: Number},
        selled: {type: Number},
        os: {type: String},
        Case: {type: String},
        cpu: {type: String},
        ram: {type: String},
        rom: {type: String},
        gpu: {type: String},
        main: {type: String}
    },
    {
        timestamps: true
    }
);
const Product = mongoose.model("Product", productSchema);

module.exports = Product;