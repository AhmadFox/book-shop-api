// Third Party Module
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

// Import Author Model
const { User, validateLoginUser, validateRegisterUser } = require('../models/User');

/**
 * @desc Register New User
 * @route /api/auth/register
 * @method POST
 * @access public
*/
const register = asyncHandler(
    async(req, res) => {

        const { error } = validateRegisterUser(req.body);
        if ( error ) {
            return res.status(400).json({ message: error.details[0].message })
        }
    
        let user = await User.findOne({email: req.body.email});
        if (user) {
            return res.status(400).json({ message: 'This user already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
        
        user = new User({
            email: req.body.email,
            userName: req.body.userName,
            password: req.body.password,
        });
    
        const result = await user.save();
        const token = user.generateToken();

        const { password, ...other } = result._doc
        res.status(201).json({ ...other, token });
    
    }
);

/**
 * @desc Login User
 * @route /api/auth/login
 * @method POST
 * @access public
*/
const login = asyncHandler(
    async(req, res) => {

        const { error } = validateLoginUser(req.body);
        if ( error ) {
            return res.status(400).json({ message: error.details[0].message })
        }
    
        let user = await User.findOne({email: req.body.email});
        if (!user) {
            return res.status(400).json({ message: 'Invalid Email Or Password' });
        }
        
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid Email Or Password' });
        }
    
        const result = await user.save();
        const token = user.generateToken();

        const { password, ...other } = result._doc
        res.status(200).json({ ...other, token });
    
    }
);

module.exports = {
    register,
    login,
}