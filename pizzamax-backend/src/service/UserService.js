const { User } = require('../models');
const thowError = require('../Helper/throwError');
const Service = require('./Service');

class UserService extends Service {
    constructor() {
        super('UserService');
    }

    form(payload) {
        const user = {
            name: payload.name,
            password: payload.password,
            phoneNumber: payload.phoneNumber,
        };

        Object.keys(user).forEach((key) => {
            user[key] || thowError(400, `missing ${key}`);
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
        const user = await this.find({ phoneNumber: payload.phoneNumber });

        if (user) {
            return throwError(409, 'Phone number have already existed');
        }

        const newUser = this.userForm(payload);

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
