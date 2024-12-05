require('dotenv').config();

const express = require('express'),
    bodyParser = require('body-parser'),
    authRoutes = require('./routes/auth'),
    app = express(),
    PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/auth', authRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));