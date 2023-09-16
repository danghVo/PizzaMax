const Service = require('./Service');
const { Cart, Detail, Product, Selection } = require('../models');
const throwError = require('../utils/throwError');
const SectionService = require('./SectionService');

class CartService extends Service {
    constructor() {
        super('CartService', Cart);
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

    async addToCart(userUUID, payload) {
        const { name, quantity, selection } = payload;
        const cartExist = await this.find(Cart, { uuid: userUUID });

        if (cartExist) {
            const product = await this.find(Product, { name });
            const detail = await Detail.create({
                quantity: quantity || 1,
                cartId: cartExist.getDataValue('uuid'),
                productId: product.getDataValue('id'),
            });

            selection.forEach(async (item) => {
                const type = await SectionService.getSection(item.type, item.name, product);
                if (type) {
                    await Selection.create({
                        detailId: detail.getDataValue('uuid'),
                        selectionId: type.getDataValue('id'),
                        section: item.section,
                        selectionType: item.type,
                    });
                } else throwError(404, 'Not have this section');
            });
        } else {
            return throwError(404, 'Cart is not existed');
        }
    }
}

module.exports = new CartService();
