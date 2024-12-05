const jwt = require('jsonwebtoken'),
    secret = process.env.JWT_SECRET,
    generateToken = (payload) => {
        return jwt.sign(payload, secret, {expiresIn: parseInt(process.env.JWT_EXPIRES_IN)});
    }, verifyToken = (token) => {
        try {
            return jwt.verify(token, secret);
        } catch (error) {
            throw new Error('Invalid Token');
        }
    };

module.exports = {generateToken, verifyToken};