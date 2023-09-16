const { User, Cart, Status, Detail, Product, Type, Size, Drink, Flavor, Crust, Selection } = require('../models');
const throwError = require('../utils/throwError');
const Service = require('./Service');
const UserService = require('./UserService');

class AuthService extends Service {
    constructor() {
        super('AuthService');
    }

    async validUser(payload) {
        const user = await UserService.find({ phoneNumber: payload.phoneNumber });
        if (!user) {
            return throwError(404, 'Not found phone number');
        }

        const carts = await user.getCarts({
            include: [
                Status,
                {
                    model: Product,
                    include: [Type, Size, Drink, Flavor, Crust],
                    through: {
                        model: Detail,
                        include: [Selection],
                    },
                },
            ],
        });
        if (user.dataValues.password !== payload.password) {
            return false;
        }

        return {
            ...user.toJSON(),
            carts: carts.map((cart, index) => {
                return cart.toJSON();
            }),
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
