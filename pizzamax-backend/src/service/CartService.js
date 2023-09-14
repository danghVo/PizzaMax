const { Cart, Detail, Product } = require('../models');
const throwError = require('../utils/throwError');
const Service = require('./Service');

class CartService extends Service {
    constructor() {
        super('CartService');
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
}

module.exports = new CartService();
