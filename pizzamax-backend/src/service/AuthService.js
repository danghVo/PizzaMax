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

        if (user.dataValues.password !== payload.password) {
            return false;
        }

        return user;
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
