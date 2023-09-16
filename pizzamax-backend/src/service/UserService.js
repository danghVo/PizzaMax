const { User, Cart } = require('../models');
const CartService = require('./CartService');
const throwError = require('../utils/throwError');
const Service = require('./Service');

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

    async validUser(payload) {
        const user = await this.find({ phoneNumber: payload.phoneNumber });

        if (!user) {
            return throwError(404, 'Not found phone number');
        }

        if (user.password != payload.password) {
            return false;
        }

        return true;
    }

    async setToken(phoneNumber, token) {
        return await this.update(phoneNumber, token);
    }

    async getToken(phoneNumber) {
        const user = await this.find(phoneNumber);

        return user.token;
    }

    async deleteToken(phoneNumber) {
        return await this.update(phoneNumber, { token: null });
    }

    async create(payload) {
        const newUser = this.form(payload);
        const user = await this.find({ phoneNumber: payload.phoneNumber });

        if (user) {
            return throwError(409, 'Phone number have already existed');
        }

        await this.model.create({ ...newUser, Carts: {} }, { include: [Cart] });
    }

    async updateUser(uuid, payload) {
        const isExist = await this.find({ uuid });

        if (isExist)
            await this.update(
                {
                    uuid: uuid,
                },
                payload,
            );
        else throwError(404, 'User doesnt exist');
    }

    async changePassword(uuid, payload) {
        const userExist = await this.find({ uuid });

        if (userExist)
            if (userExist.dataValues.password === payload.password)
                await this.update(
                    {
                        password: payload.password,
                    },
                    { password: payload.newPassword },
                );
            else throwError(400, 'Wrong old password');
        else throwError(404, 'User doesnt exist');
    }
}

module.exports = new UserService();
