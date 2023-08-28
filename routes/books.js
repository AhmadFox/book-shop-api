const express = require('express');
const router = express.Router();
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');

// Third Party Module
const asyncHandler = require('express-async-handler');

// Import Book Model
const { Book, validateCreateBook, validateUpdateBook } = require('../models/Book');

/**
 * @desc Get all books
 * @route /api/books
 * @method GEt
 * @access public
*/
router.get('/', asyncHandler(
    async (req, res) => {
        // Declare Query Params for API
        const { minPrice, maxPrice } = req.query;
        let book;
        if(minPrice || maxPrice) {
            book = await Book.find({
                // price: 10 // get books that has price = 10
                price: {
                    $gte: minPrice, $lte: maxPrice
                    // $eq: 10 // same also get books that has price = 10 (comperioson Query Operator)
                    // $ne: 10 // get books that has price exepet = 10 (compereson query operator)
                    // $lt: 10 // get books thats less than < 10
                    // $lte: 10 // get books thats less than and equale <= 10
                    // $gt: 10 // get books thats grater than > 10
                    // $gte: 10 // get books thats grater than or equale > 10
                    // $in: [8, 9] // get books thats equale price 8 and 9
                }
            })
            .populate("author",["_id", "firstName", "lastName"]);
        } else {
            book = await Book.find().populate("author",["_id", "firstName", "lastName"]);
        }
        
        // const book = await Book.find().sort({firstName: 1}); // Sort BY Name Asynding
        // const book = await Book.find().sort({firstName: -1}); // Sort BY Name  Desinding
        // const book = await Book.find().select("firstName lastName"); // Return Only First Name & Last Name
        // const book = await Book.find().select("firstName lastName -_id"); // Return Only First Name & Last Name withgout id
        res.status(200).json(book);
    }
))

/**
 * @desc Get book by id
 * @route /api/books/:id
 * @method GEt
 * @access public
*/
router.get('/:id', asyncHandler(
    async (req, res) => {
        const book = await Book.findById(req.params.id).populate("author", ["_id", "firstName", "lastName"]);
        if(book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({message: 'Book Not Found'})
        }   
    }
));

/**
 * @desc Create new book
 * @route /api/books
 * @method POST
 * @access private (only admin)
*/
router.post('/', verifyTokenAndAdmin, asyncHandler(
    async(req, res) => {

        const { error } = validateCreateBook(req.body)
    
        if (error) {
            return res.status(400).json(error.details[0].message)
        }
    
       const book = new Book({
            title: req.body.title,
            author: req.body.author,
            description: req.body.description,
            price: req.body.price,
            cover: req.body.cover
       })
    
        const result = await book.save();
        res.status(201).json(result);
    
    }
));

/**
 * @desc Update a book
 * @route /api/books/:id
 * @method PUT
 * @access private (only admin)
*/
router.put('/:id', verifyTokenAndAdmin, asyncHandler(
    async(req, res) => {

        const {error} = validateUpdateBook(req.body)
        if (error) {
            return res.status(400).json(error.details[0].message)
        }
    
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, {
            $set: {
                title: req.body.title,
                author: req.body.author,
                description: req.body.description,
                price: req.body.price,
                cover: req.body.cover
            }
        }, { new: true });
        res.status(200).json(updatedBook);
    }
))

/**
 * @desc Delete a book
 * @route /api/books/:id
 * @method DELETE
 * @access private (only admin)
*/
router.delete('/:id', verifyTokenAndAdmin, asyncHandler(
    async(req, res) => {

        const book = await Book.findById(req.params.id);
        if(book) {
            await Book.findByIdAndDelete(req.params.id)
            res.status(200).json({message: 'Book has been deleted'}); // delete Successfuly
        } else {
            res.status(404).json({message: 'Book not found'});
        }
    }
))

module.exports = router;