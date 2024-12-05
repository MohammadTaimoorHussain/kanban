const express = require('express'),
    bcrypt = require('bcryptjs'),
    {generateToken} = require('../utils/jwt'),
    router = express.Router(),
    mockUsers = [
        {
            id: 1,
            email: "user1@jwt.com",
            password: bcrypt.hashSync('password', 10)
        },
        {
            id: 2,
            email: "user2@jwt.com",
            password: bcrypt.hashSync('password', 10)
        }
    ],
    authenticate = require('../middleware/authMiddleware');

//*** Login Route ***//
router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    if (!email) {
        return res.status(401).json({
            message: 'Email field is required'
        });
    }

    if (!password) {
        return res.status(401).json({
            message: 'Password field is required'
        });
    }

    const user = mockUsers.find((u) => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({
            message: 'Invalid Credentials'
        });
    }

    const token = generateToken({
        id: user.id,
        email: user.email
    });
    res.json({
        message: 'Logged in successfully.',
        token
    });
});

//*** Profile Route ***//
router.get('/profile', authenticate, (req, res) => {
    res.json({
        message: 'This is a protected route', user: req.user
    });
});

module.exports = router;