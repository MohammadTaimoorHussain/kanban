const {verifyToken} = require('../utils/jwt'),
    authenticate = (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                message: 'Token required'
            });
        }

        try {
            req.user = verifyToken(token)
            next();
        } catch (error) {
            res.status(401).json({
                message: 'Invalid Token'
            });
        }
    };

module.exports = authenticate;