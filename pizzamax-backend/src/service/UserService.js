const { User, Cart, City, Type } = require('../models');
const throwError = require('../utils/throwError');
const Service = require('./Service');
const CartService = require('./CartService');

class UserService extends Service {
    constructor() {
        super('UserService', User);
    }

    form(payload) {
        const user = {
            name: payload.name,
            phoneNumber: payload.phoneNumber,
            password: payload.password,
        };

        Object.keys(user).forEach((key) => {
            user[key] || throwError(400, `Missing ${key}`);
        });

        return user;
    }

    async setToken(phoneNumber, token) {
        return await this.update(phoneNumber, token);
    }

    async getToken(phoneNumber) {
        const user = await this.find(phoneNumber);

        return user.token;
    }

    async getUserInfor(user) {
        const favorite = await user.getProducts({ include: [Type] });
        const address = await user.getAddresses({ include: City });
        let carts = await CartService.getCartOfUser(user.getDataValue('id'));

        return {
            ...user.toJSON(),
            address,
            carts,
            favorite,
        };
    }

    async deleteToken(phoneNumber) {
        return await this.update(phoneNumber, { token: null });
    }

    async userExist(uuid) {
        const userExist = await this.find({ uuid });

        if (userExist) {
            return userExist;
        } else throwError(404, 'User not found');
    }

    async create(payload) {
        const newUser = this.form(payload);
        const user = await this.find({ phoneNumber: payload.phoneNumber });

        if (user) {
            return throwError(409, 'Phone number have already existed');
        }

        await this.model.create({ ...newUser, Carts: {} }, Cart);
    }

    async updateUser(user, payload) {
        await this.update(
            {
                uuid: user.getDataValue('uuid'),
            },
            payload,
        );
    }

    async changePassword(user, payload) {
        if (user.getDataValue('password') === payload.password)
            await this.update(
                {
                    password: payload.password,
                },
                { password: payload.newPassword },
            );
        else throwError(400, 'Wrong old password');
    }
}

module.exports = new UserService();
