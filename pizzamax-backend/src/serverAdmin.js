const express = require('express');
const app = express();
const cors = require('cors');
const { sequelize } = require('./models');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const routers = require('./router/adminRouter');
const throwError = require('./Helper/throwError');

app.use(cors({ origin: true }));
app.use(express.json());

app.all(/\/.*/, (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1] || throwError(401, 'Missing token');

        const isValid = jwt.verify(token, process.env.ADMIN_TOKEN_SECRET);

        if (isValid) {
            next();
        }

        throwError(403, 'Dont have right to access');
    } catch (error) {
        return res.send(error?.message || error);
    }

    next();
});

Object.values(routers).forEach((router) => {
    app.use('/api/admin', router);
});

app.listen({ port: 4003 }, async () => {
    console.log(`Server on port 4003`);

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
