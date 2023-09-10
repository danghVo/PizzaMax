const throwError = require('../utils/throwError');
const jwt = require('jsonwebtoken');

class AdminController {
    constructor() {
        this.name = 'AdminController';
    }

    async authenticate(req, res, next) {
        try {
            const path = req.url.split('/')[2];
            if (path == 'register') next();

            const token = req.headers['authorization']?.split(' ')[1] || throwError(401, 'Missing token');

            const isValid = jwt.verify(token, process.env.ADMIN_TOKEN_SECRET);

            if (isValid) {
                next();
            }

            throwError(403, 'Dont have right to access');
        } catch (error) {
            return res.send(error?.message || error);
        }
    }
}

module.exports = new AdminController();
