// Third Party Module
const asyncHandler = require('express-async-handler');

// Import Author Model
const { Author, validateCreateAuthor, validateUpdateAuthor } = require('../models/Author');

/**
 * @desc Get all author
 * @route /api/authors
 * @method GEt
 * @access public
*/
const getAllAuthors = asyncHandler(
    async (req, res) => {
        const { pageNumber } = req.query;
        let authorList;
        if( pageNumber ) {
            const authorPerPage = 2;
            authorList = await Author.find()
            .skip( (pageNumber - 1) * authorPerPage ) // Skip first 2 Authors
            .limit(2); // return only 2 Authors
        } else {
            authorList = await Author.find();
        }
        // const authorList = await Author.find().skip(2); // Skip first 2 Authors
        // const authorList = await Author.find().sort({firstName: 1}); // Sort BY Name Asynding
        // const authorList = await Author.find().sort({firstName: -1}); // Sort BY Name  Desinding
        // const authorList = await Author.find().select("firstName lastName"); // Return Only First Name & Last Name
        // const authorList = await Author.find().select("firstName lastName -_id"); // Return Only First Name & Last Name withgout id
        res.status(200).json(authorList);
    }
);

/**
 * @desc Get author by id
 * @route /api/authors/:id
 * @method GEt
 * @access public
*/
const getAuthorById = asyncHandler(
    async (req, res) => {
        const author = await Author.findById(req.params.id);
        if(author) {
            res.status(200).json(author);
        } else {
            res.status(404).json({message: 'Author Not Found'})
        }   
    }
);

/**
 * @desc Create author
 * @route /api/authors
 * @method POST
 * @access private (only admin)
*/
const createAuthor = asyncHandler(
    async (req, res) => {

        const {error} = validateCreateAuthor(req.body)
    
        if (error) {
            return res.status(400).json(error.details[0].message)
        }
    
        const author = new Author({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            nationality: req.body.nationality,
            image: req.body.image
        });

        const result = await author.save();
        res.status(201).json(result);
    
    }
);

/**
 * @desc Update a author
 * @route /api/authors/:id
 * @method PUT
 * @access public
*/
const updateAuthor = asyncHandler(
    async (req, res) => {

        const {error} = validateUpdateAuthor(req.body)
        if (error) {
            return res.status(400).json(error.details[0].message)
        }
    
        const author = await Author.findByIdAndUpdate(req.params.id, {
            $set: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                nationality: req.body.nationality,
                image: req.body.image
            }
        }, { new: true });
        res.status(200).json(author);

    }
)

/**
 * @desc Delete a author
 * @route /api/authors/:id
 * @method DELETE
 * @access public
*/
const deleteAuthor = asyncHandler(
    async (req, res) => {

        const author = await Author.findById(req.params.id);
        if(author) {
            await Author.findByIdAndDelete(req.params.id)
            res.status(200).json({message: 'Author has been deleted'}); // delete Successfuly
        } else {
            res.status(404).json({message: 'Author not found'});
        }
    }
);

module.exports = {
    getAllAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor
}