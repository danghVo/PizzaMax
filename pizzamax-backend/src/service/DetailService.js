const { Detail, Selection } = require('../models');
const Service = require('./Service');
const SelectionService = require('./SelectionService');

class DetailService extends Service {
    constructor() {
        super('DetailService', Detail);
    }

    async checkDetailExist(product, cart, selections) {
        const detailCheck = await this.getAllBy(
            { productId: product.getDataValue('id'), cartUUID: cart.getDataValue('uuid') },
            {
                include: Selection,
            },
        );
        const selectionName = selections.map((selection) => selection.name);

        for await (const detail of detailCheck) {
            const check = await SelectionService.checkSelectionExist(detail, selectionName);

            if (check) return true;
        }

        return false;
    }
}

module.exports = new DetailService();
