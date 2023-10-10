const throwError = require('../utils/throwError');
const { UserService, AuthService } = require('../service');
const Controller = require('./Controller');

class UserController extends Controller {
    constructor() {
        super('UserController');
    }

    async checkUser(req, res, next) {
        try {
            const uuid = req.params.uuid;
            const userExist = await UserService.userExist(uuid);
            res.locals.user = userExist;
            next();
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async getUserInfor(req, res, next) {
        try {
            const user = res.locals.user;
            if (user.getDataValue('role') !== 'admin') {
                const userInfor = await UserService.getUserInfor(user);
                res.locals.user = userInfor;
            } else res.locals.user = user.toJSON();

            next();
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async getInforByToken(req, res) {
        try {
            const user = await AuthService.validUser({
                phoneNumber: res.locals.phoneNumber,
                password: res.locals.password,
            });

            const userInfor = await UserService.getUserInfor(user);

            return res.json(userInfor);
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async register(req, res, next) {
        try {
            await UserService.create(req.body);

            return res.status(200).send('User was created successfully');
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async updateUser(req, res, next) {
        try {
            const payload = req.body;
            const user = res.locals.user;

            if (payload) {
                delete payload.phoneNumber;
                delete payload.password;
            }

            await UserService.updateUser(user, payload);

            res.status(200).send('Update successfully');
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async changePassword(req, res) {
        try {
            const user = res.locals.user;

            await UserService.changePassword(user, req.body);

            res.status(200).send('Change password successfully');
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }
}

module.exports = new UserController();
