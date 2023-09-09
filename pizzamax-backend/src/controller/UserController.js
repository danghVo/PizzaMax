const throwError = require('../Helper/throwError');
const { UserService } = require('../service');
const jwt = require('jsonwebtoken');

class UserController {
    constructor() {
        this.name = 'UserController';
    }

    async login(req, res, next) {
        try {
            const isUserValid = await UserService.validUser(req.body);

            if (isUserValid) {
                next();
            } else {
                throwError(401, 'wrong password');
            }
        } catch (error) {
            return res.send(error?.message || error);
        }
    }

    async authenticate(req, res, next) {
        try {
            const path = req.url.split('/')[2];
            if (path == 'register') next();

            const token = req.headers['authorization']?.split(' ')[1] || throwError(401, 'Missing token');

            const isValid = jwt.verify(
                token,
                req.body.phoneNumber == '0000000000' ? process.env.ADMIN_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET,
            );

            if (isValid) {
                next();
            }

            throwError(403, 'Dont have right to access');
        } catch (error) {
            return res.send(error?.message || error);
        }
    }

    async register(req, res, next) {
        try {
            await UserService.create(req.body);

            return res.send('User was created successfully');
        } catch (error) {
            return res.send(error?.message || error);
        }
    }

    async changePassword(req, res) {
        try {
            await UserService.changePassword(req.body);

            res.status(200).send('Change password success fully');
        } catch (error) {
            return res.send(error?.message || error);
        }
    }

    async changeName(req, res) {
        try {
            await UserService.changeName(req.body);

            res.status(200).send('Change name successfully');
        } catch (error) {
            return res.send(error?.message || error);
        }
    }
}

module.exports = new UserController();
