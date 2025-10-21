const mongoose = require('mongoose');

// define the schema
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        role: {
            type: String,
            enum: ['borrower', 'lender', 'admin'],
            default: 'borrower',
        }
    }, { timestamps: true }
);

// create the model
const User = mongoose.model('User', userSchema);

module.exports = User;