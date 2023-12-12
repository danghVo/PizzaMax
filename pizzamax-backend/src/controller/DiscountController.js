const { DiscountService, ProductService } = require('../service');
const throwError = require('../utils/throwError');

class DiscountController {
    constructor() {
        this.controllerName = 'DiscountController';
    }

    async getAll(req, res) {
        try {
            const discounts = await DiscountService.getAllDetail();

            return res.json(discounts);
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async createDiscount(req, res) {
        try {
            await DiscountService.createDiscount(req.body);

            const discounts = await DiscountService.getAllDetail();

            return res.json(discounts);
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async updateDiscount(req, res, next) {
        try {
            const discountId = req.params.id;

            await DiscountService.updateDiscount(discountId, req.body);

            const discounts = await DiscountService.getAllDetail();

            res.json(discounts);
            next();
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async deleteDiscount(req, res) {
        try {
            const discountId = req.params.id;

            await ProductService.update({ discountId }, { discountId: null });
            await DiscountService.deleteDiscount(discountId);

            const discounts = await DiscountService.getAllDetail();

            return res.json(discounts);
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }
}

module.exports = new DiscountController();
