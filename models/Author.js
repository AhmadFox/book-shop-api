const mongoose = require('mongoose');

// Third Party Module
const Joi = require('joi');

// Decleration Schema
const AuthorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    nationality: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    image: {
        type: String,
        default: 'default-avatar.png'
    },
}, {
    timestamps: true
});

// Decleration Model
const Author = mongoose.model("Author", AuthorSchema);

// Validate Create Author
function validateCreateAuthor(obj) {
    const schema = Joi.object({
        firstName: Joi.string().trim().min(3).max(20).required(),
        lastName: Joi.string().trim().min(3).max(20).required(),
        nationality: Joi.string().trim().min(3).max(20).required(),
        image: Joi.string().trim(),
    });

    return schema.validate(obj)
}

// Validate Update Author
function validateUpdateAuthor(obj) {
    const schema = Joi.object({
        firstName: Joi.string().trim().min(3).max(20),
        lastName: Joi.string().trim().min(3).max(20),
        nationality: Joi.string().trim().min(3).max(20),
        image: Joi.string(),
    });

    return schema.validate(obj)
}

module.exports = {
    Author,
    validateCreateAuthor,
    validateUpdateAuthor,
}
