const { DiscountService } = require('../service');
const throwError = require('../utils/throwError');

class DiscountController {
    constructor() {
        this.controllerName = 'DiscountController';
    }

    async getAll(req, res) {
        try {
            const discounts = await DiscountService.getAll();

            return res.json(addresses);
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async createDiscount(req, res) {
        try {
            const discount = await DiscountService.createDiscount(req.body);

            return res.json(discount);
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async updateDiscount(req, res) {
        try {
            const discountId = req.params.id;

            const discount = await DiscountService.updateDiscount(discountId, req.body);

            res.json(discount);
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async deleteDiscount(req, res) {
        try {
            const discountId = req.params.id;

            await DiscountService.deleteDiscount(discountId);

            res.status(200).send('Deleted discount successfully');
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }
}

module.exports = new DiscountController();
