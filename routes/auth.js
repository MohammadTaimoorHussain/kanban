const express = require('express'),
    bcrypt = require('bcryptjs'),
    {generateToken} = require('../utils/jwt'),
    router = express.Router(),
    mysql = require('mysql'),
    db = mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: "root",
        database: 'kanban'
    }),
    authenticate = require('../middleware/authMiddleware');

db.connect((err) => {
    if (err) {
        return console.log('Error connecting to MySQL:', err);
    }
    console.log('Connected to MySQL');
});

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

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).json({error: 'Database query error'});
        }
        if (results.length === 0) {
            return res.status(400).json({message: 'User not found'});
        }

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({error: 'Error comparing passwords'});
            }
            if (!isMatch) {
                return res.status(400).json({message: 'Incorrect password'});
            }

            const token = generateToken({
                id: user.id,
                email: user.email
            });

            res.json({
                message: 'Logged in successfully.',
                token,
                user
            });
        });
    });
});

//*** Profile Route ***//
router.get('/profile', authenticate, (req, res) => {
    res.json({
        message: 'This is a protected route', user: req.user
    });
});

module.exports = router;