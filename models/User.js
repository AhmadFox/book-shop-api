const mongoose = require('mongoose');

// Third Party Module
const Joi = require('joi');
const jwt = require('jsonwebtoken');

// Decleration Schema
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100,
        unique: true
    },
    userName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 200,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

// Genarate Token
UserSchema.methods.generateToken = function() {
    return jwt.sign({ id: this._id, isAdmin: this.isAdmin }, process.env.JWT_SECRET_KEY, { // userName: user.userName (to return username in the payload)
        expiresIn: '4d' // '4h' or '4m' Hour or minutes
    });
}

// Decleration Model
const User = mongoose.model("User", UserSchema);

// Validate Register User
function validateRegisterUser(obj) {
    const schema = Joi.object({
        email: Joi.string().trim().min(5).max(100).email().required(),
        userName: Joi.string().trim().min(2).max(200).required(),
        password: Joi.string().trim().min(6).required(),
    });

    return schema.validate(obj)
}

// Validate Login User
function validateLoginUser(obj) {
    const schema = Joi.object({
        email: Joi.string().trim().min(5).max(100).email().required(),
        password: Joi.string().trim().min(6).required(),
    });

    return schema.validate(obj)
}

// Validate Update User
function validateUpdateUser(obj) {
    const schema = Joi.object({
        email: Joi.string().trim().min(5).max(100).email(),
        userName: Joi.string().trim().min(2).max(200),
        password: Joi.string().trim().min(6),
    });

    return schema.validate(obj)
}

module.exports = {
    User,
    validateRegisterUser,
    validateLoginUser,
    validateUpdateUser
}