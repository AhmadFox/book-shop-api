// Third Party Module
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

// Import Author Model
const { User, validateUpdateUser } = require('../models/User');


/**
 * @desc Get All User
 * @route /api/users
 * @method GET
 * @access private (only admin)
*/
const getAllUsers = asyncHandler(
    async(req, res) => {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    }
);

/**
 * @desc Get User By Id
 * @route /api/users/:id
 * @method GET
 * @access private (only admin and user himself)
*/
const getUserById = asyncHandler(
    async(req, res) => {
        const user = await User.findById(req.params.id).select('-password');
        if(user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({message: 'User Not Found'})
        }  
    }
);

/**
 * @desc Delete User By Id
 * @route /api/users/:id
 * @method DELETE
 * @access private (only admin and user himself)
*/
const deleteUser = asyncHandler(
    async(req, res) => {
        const user = await User.findById(req.params.id).select('-password');
        if(user) {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'User has been deleted' });
        } else {
            res.status(404).json({message: 'User Not Found'})
        }  
    }
);

/**
 * @desc Update User
 * @route /api/users/:id
 * @method PUT
 * @access private
*/
const updateUser = asyncHandler(
    async(req, res) => {

        const { error } = validateUpdateUser(req.body);
        if (error) {
            return res.status(400).json({ messge: error.details[0].message });
        }

        if(req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt)
        }
        
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                email: req.body.email,
                password: req.body.password,
                userName: req.body.userName
            }
        }, { new: true });

        res.status(200).json(updatedUser);
    
    }
);

module.exports = {
    getAllUsers,
    getUserById,
    deleteUser,
    updateUser,
}