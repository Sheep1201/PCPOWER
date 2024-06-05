const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
    {
        name: {type: String},
        email: {type: String,  unique: true},
        password: {type: String},
        isAdmin: {type: Boolean, default: false},
        phone: {type: Number},
        address: {type: String}
    },
    {
        timestamps: true
    }
);
const User = mongoose.model("User", userSchema);

module.exports = User;