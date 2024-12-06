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

const getUser = async (email) => {
    try {
        return await new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
                if (err) {
                    return reject({
                        message: err,
                        status: 500
                    });
                }
                if (results.length === 0) {
                    return resolve({
                        message: 'User not found.',
                        status: 400
                    });
                }
                return resolve({
                    data: results[0],
                    status: 200
                });
            });
        });
    } catch (error) {
        return resolve({
            message: error.message,
            status: 400
        });
    }
};


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
    const userQuery = await getUser(email);
    if (userQuery.status !== 200) {
        return res.status(401).json({
            message: userQuery.message
        });
    }

    bcrypt.compare(password, userQuery.data.password, (err, isMatch) => {
        if (err) {
            return res.status(500).json({message: 'Error comparing passwords'});
        }
        if (!isMatch) {
            return res.status(400).json({message: 'Incorrect password'});
        }

        const token = generateToken({
            id: userQuery.data.id,
            email: userQuery.data.email
        });

        res.json({
            message: 'Logged in successfully.',
            token,
            user: userQuery.data
        });
    });
});

//*** Profile Route ***//
router.get('/dashboard', authenticate, (req, res) => {
    console.log(req.user)
    res.json({
        message: 'This is a protected route', user: req.user
    });
});

//*** Profile Route ***//
router.get('/profile', authenticate, async (req, res) => {
    const userQuery = await getUser(req.user.email);
    res.json({
        user: userQuery.data
    });
});

module.exports = router;