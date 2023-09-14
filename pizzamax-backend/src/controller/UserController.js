const throwError = require('../utils/throwError');
const { UserService } = require('../service');
const Controller = require('./Controller');

class UserController extends Controller {
    constructor() {
        super('UserController');
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

    async updateUser(req, res, next) {
        try {
            const payload = req.body;
            const uuid = req.params.uuid;

            if (payload) {
                delete payload.phoneNumber;
                delete payload.password;
            }

            await UserService.updateUser(uuid, payload);

            res.status(200).send('Update successfully');
        } catch (error) {
            return res.send(error?.message || error);
        }
    }

    async changePassword(req, res) {
        try {
            const uuid = req.params.uuid;

            await UserService.changePassword(uuid, req.body);

            res.status(200).send('Change password successfully');
        } catch (error) {
            return res.send(error?.message || error);
        }
    }
}

module.exports = new UserController();
