const express = require('express');
const router = express.Router();
const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require('../middlewares/verifyToken');

// Import Controllers
const { getAllUsers, getUserById, deleteUser, updateUser } = require('../controllers/userController');

// Method Chain: /api/users/
router.route('/')
    .get(verifyTokenAndAdmin, getAllUsers);

// Method Chain: /api/users/:id
router.route('/:id')
    .get(verifyTokenAndAuthorization, getUserById)
    .delete(verifyTokenAndAuthorization, deleteUser)
    .put(verifyTokenAndAuthorization, updateUser);

module.exports = router;