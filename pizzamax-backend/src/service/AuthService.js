const { User } = require('../models');
const throwError = require('../utils/throwError');
const Service = require('./Service');

class AuthService extends Service {
    constructor() {
        super('AuthService');
    }

    async validUser(payload) {
        const user = await this.find(User, { phoneNumber: payload.phoneNumber });

        if (!user) {
            return throwError(404, 'Not found phone number');
        }

        if (user.dataValues.password !== payload.password) {
            return false;
        }

        return user;
    }

    async setToken(user, token) {
        return await this.update(User, user, token);
    }

    async getToken(user) {
        const userStorage = await this.find(User, user);

        return userStorage.token;
    }

    async deleteToken(user) {
        return await this.update(User, user, { token: null });
    }
}

module.exports = new AuthService();
