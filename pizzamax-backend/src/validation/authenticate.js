const jwt = require('jsonwebtoken');
const path = require('path');
const throwError = require('../utils/throwError');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const exceptions = ['/api/auth/', '/api/user/register', '/api/product/getAll'];

module.exports = function authenticate(req, res, next) {
    try {
        const path = req.url;
        let isException = false;

        exceptions.forEach((exception) => {
            if (path.includes(exception)) {
                isException = true;
                return next();
            }
        });

        if (isException) return;

        const token = req.headers['authorization']?.split(' ')[1] || throwError(401, 'Missing token');

        const isValid = jwt.verify(
            token,
            req.body.phoneNumber == '0000000000' ? process.env.ADMIN_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET,
        );

        if (isValid) {
            return next();
        }

        return throwError(403, 'Dont have right to access');
    } catch (error) {
        return res.send(error?.message || error);
    }
};
