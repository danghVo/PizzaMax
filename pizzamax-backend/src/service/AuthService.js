const { User, Cart, Status, Detail, Product, Type, Size, Drink, Flavor, Crust, Selection } = require('../models');
const throwError = require('../utils/throwError');
const Service = require('./Service');
const UserService = require('./UserService');
const CartService = require('./CartService');

class AuthService extends Service {
    constructor() {
        super('AuthService');
    }

    async validUser(payload) {
        const user = await UserService.find({ phoneNumber: payload.phoneNumber });
        if (!user) {
            return throwError(404, 'Not found phone number');
        }

        let carts = await CartService.getCartOfUser(user.dataValues.id);

        if (user.dataValues.password !== payload.password) {
            return false;
        }

        return {
            ...user.toJSON(),
            carts,
        };
    }

    async setToken(user, token) {
        return await UserService.update(user, token);
    }

    async getToken(user) {
        const userStorage = await UserService.find(user);

        return userStorage.token;
    }

    async deleteToken(user) {
        return await UserService.update(user, { token: null });
    }
}

module.exports = new AuthService();
