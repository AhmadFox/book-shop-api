const mongoose = require('mongoose');

// Third Party Module
const Joi = require('joi');

// Decleration Schema
const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    author: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Author"
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 500
    },
    price: {
        type: Number,
        required: true,
        min: 1,
        max: 999
    },
    cover: {
        type: String,
        required: true,
        enum: ["soft cover", "hard cover"]
    },
}, {
    timestamps: true
});

// Decleration Model
const Book = mongoose.model("Book", BookSchema);

// Validate Create Book
function validateCreateBook(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(3).max(50).required(),
        author: Joi.string().required(),
        description: Joi.string().trim().min(10).max(500).required(),
        price: Joi.number().min(1).max(999).required(),
        cover: Joi.string().valid("soft cover", "hard cover").required(),
    });

    return schema.validate(obj)
}

// Validate Update Book
function validateUpdateBook(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(3).max(50),
        author: Joi.string(),
        description: Joi.string().trim().min(10).max(500),
        price: Joi.number().min(1).max(999),
        cover: Joi.string().valid("soft cover", "hard cover"),
    });

    return schema.validate(obj)
}

module.exports = {
    Book,
    validateUpdateBook,
    validateCreateBook
}

