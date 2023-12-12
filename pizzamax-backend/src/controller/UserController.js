const throwError = require('../utils/throwError');
const { UserService, AuthService } = require('../service');
const Controller = require('./Controller');
const CartService = require('../service/CartService');
const S3Service = require('../service/S3Service');

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
            if (user.role !== 'admin') {
                if (req.body.currentCart) {
                    await CartService.setCartToCartOfUser(user, req.body.currentCart);
                }
                const userInfor = await UserService.getUserInfor(user);
                res.locals.user = userInfor;
            } else res.locals.user = user.toJSON();
            next();
        } catch (error) {
            return res.status(200).send({ error: error.message || error });
        }
    }

    async getInforByToken(req, res) {
        try {
            const user = await AuthService.validUser({
                phoneNumber: res.locals.phoneNumber,
                password: res.locals.password,
            });

            const userInfor = await UserService.getUserInfor(user);

            return res.json({
                ...userInfor,
                password: undefined,
            });
        } catch (error) {
            return res.status(200).send({ error: error.message || error });
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

    async createAdmin(req, res) {
        try {
            await UserService.createAdmin(req.body);

            const result = await UserService.getAllUser();

            res.json(result);
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async update(req, res) {
        try {
            const user = res.locals.user;

            await UserService.updateUser(user, req.body);

            const userInfor = await UserService.getUserInfor(user);

            return res.json({
                ...userInfor,
                password: undefined,
            });
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async createNewCart(req, res) {
        try {
            const user = res.locals.user;

            const result = await CartService.createNewCart(user.id);

            res.json(result);
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async addAvatar(req, res) {
        try {
            const image = req.file;
            const user = res.locals.user;

            await UserService.addAvatar(user, image);
            const userInfor = await UserService.getUserInfor(user);

            return res.json({
                ...userInfor,
                password: undefined,
            });
        } catch (error) {
            return res.status(error.code || 500).send({ error: 'Có lỗi xảy ra. Hãy thử lại sau' });
        }
    }

    async getAllUser(req, res) {
        try {
            const result = await UserService.getAllUser();

            res.json(result);
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async deleteUser() {}

    async updateUser() {}
}

module.exports = new UserController();
