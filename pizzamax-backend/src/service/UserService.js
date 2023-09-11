const { User } = require('../models');
const throwError = require('../utils/throwError');
const Service = require('./Service');

class UserService extends Service {
    constructor() {
        super('UserService');
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
        const user = await this.find(User, { phoneNumber: payload.phoneNumber });

        if (user) {
            return throwError(409, 'Phone number have already existed');
        }

        await User.create(newUser);
    }

    async changePassword(payload) {
        await this.update(
            {
                phoneNumber: payload.phoneNumber,
                password: payload.password,
            },
            { password: payload.newPassword },
        );
    }

    async changeName(payload) {
        await this.update(
            {
                phoneNumber: payload.phoneNumber,
            },
            { name: payload.newName },
        );
    }
}

module.exports = new UserService();
