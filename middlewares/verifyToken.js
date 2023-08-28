const jwt = require('jsonwebtoken');

// Verify Token
function verifyToken(req, res, next) {
    const token = req.headers.token;
    if (token) {
       try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
       } catch (error) { 
            res.status(401).json({ message: 'Invalid Token' })
       }
    }else {
        res.status(401).json({ message: 'No token provided' })
    }
}

// Verify Token & Authorization The User
function verifyTokenAndAuthorization(req, res, next) {
    verifyToken(req, res, () => {
        if(req.user.id === req.params.id || req.user.isAdmin ) {
            next();
        } else {
            return res.status(403) // Forbidden
                .json({ message: 'You not allowd' })
        }
    })
}

// Verify Token & Admin
function verifyTokenAndAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if(req.user.isAdmin ) {
            next();
        } else {
            return res.status(403) // Forbidden
                .json({ message: 'You not allowd only admin' })
        }
    })
}

module.exports = {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndAuthorization
}