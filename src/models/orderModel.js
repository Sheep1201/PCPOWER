const mongoose = require('mongoose')
const cartSchema = new mongoose.Schema({
    cartItems: [
        {
            name: { type: String, require: true },
            amount: { type: Number, require: true },
            image: { type: String, require: true },
            price: { type: Number, require: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                require: true
            }
        }
    ],
    shippingAddress:
    {
        fullname: { type: String, require: true },
        email: { type: String, require: true },
        phone: { type: Number, require: true },
        address: { type: String, require: true },
    },
    paymentMethod: { type: String, require: true },
    totalPrice: { type: String, require: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
},
    {
        timestamps: true,
    }
);
const Cart = mongoose.model("Oder", cartSchema);

module.exports = Cart;