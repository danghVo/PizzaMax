const jwt = require('jsonwebtoken');
const path = require('path');
const throwError = require('../utils/throwError');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const exceptions = ['/api/auth/', '/api/user/register', '/product/getAll', '/address/getAllShopAddress'];

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

        const { accessToken } = req.cookies['token'];

        const decoded = jwt.verify(
            accessToken,
            path.includes('/admin/') ? process.env.ADMIN_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET,
        );

        if (decoded) {
            res.locals.phoneNumber = decoded.phoneNumber;
            res.locals.password = decoded.password;
            return next();
        }

        return throwError(403, 'Dont have right to access');
    } catch (error) {
        return res.status(error.code || 500).send({ error: error.message || error });
    }
};
