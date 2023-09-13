const throwError = require('../utils/throwError');
const { UserService } = require('../service');

class UserController {
    constructor() {
        this.controllerName = 'UserController';
    }

    async login(req, res, next) {
        try {
            const userValid = await UserService.validUser(req.body);

            if (userValid) {
                next();
            } else {
                throwError(401, 'wrong password');
            }
        } catch (error) {
            return res.send(error?.message || error);
        }
    }

    async register(req, res, next) {
        try {
            await UserService.create(req.body);

            return res.status(200).send('User was created successfully');
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
