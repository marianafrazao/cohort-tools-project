const mongoose = require("mongoose")
const { Schema, model } = mongoose;

const userShema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
});

module.exports = model("User", userSchema);