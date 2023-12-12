const { Detail, Selection, Product, Type, Cart } = require('../models');
const Service = require('./Service');
const SelectionService = require('./SelectionService');
const CartService = require('./CartService');

class DetailService extends Service {
    constructor() {
        super('DetailService', Detail);
    }

    async getAllDetail() {
        const allDetails = await this.getAll([
            {
                model: Product,
                include: [Type],
            },
            {
                model: Cart,
                attributes: ['statusId', 'checkOutAt'],
            },
            {
                model: Selection,
            },
        ]);

        return allDetails;
    }

    async checkDetailExist(product, cart, selections) {
        const detailCheck = await this.getAllBy({ productId: product.id, cartUUID: cart.uuid }, [Selection]);
        const selectionName = selections.map((selection) => selection.name);

        for await (const detail of detailCheck) {
            const check = await SelectionService.checkSelectionExist(detail, selectionName);

            if (check) return detail;
        }

        return null;
    }

    async checkProductIsUsed(productId) {
        const check = await this.find({ productId });

        if (check) return true;
        else return false;
    }
}

module.exports = new DetailService();
