const { Discount, User, City } = require('../models');

const Service = require('./Service');
const ProductService = require('./ProductService');
const throwError = require('../utils/throwError');

class DiscountService extends Service {
    constructor() {
        super('DiscountService', Discount);
    }

    form(payload) {
        const discount = {
            saleOff: payload.saleOff,
            startAt: payload.startAt,
            endAt: payload.endAt,
        };

        Object.keys(discount).forEach((key) => {
            discount[key] || throwError(400, `Missing ${key}`);
        });

        return discount;
    }

    async getAllDetail() {
        return await this.getAll();
    }

    checkDate(startAt, endAt) {
        const currentDate = new Date(Date.now()).toLocaleDateString();

        if (startAt < currentDate || endAt < currentDate || startAt > endAt) {
            throwError(400, 'Sai thời gian');
        }

        return true;
    }

    async createDiscount(payload) {
        const discountForm = this.form(payload);

        if (this.checkDate(discountForm.startAt, discountForm.endAt)) {
            console.log(discountForm);
            const discoutExist = await this.find(discountForm);
            if (!discoutExist) return await this.model.create(discountForm);
            else return throwError(409, 'Discount exist');
        }
    }

    async updateDiscount(discountId, payload) {
        const discountExist = await this.find({ id: discountId });
        if (discountExist) {
            let startAt = payload.startAt;
            let endAt = payload.endAt;

            if (this.checkDate(startAt, endAt)) {
                console.log(startAt, endAt);
                await this.update({ id: discountId }, { ...payload });
            }
        } else return throwError(404, 'Discount not exist');
    }

    async deleteDiscount(discountId) {
        const discountExist = await this.find({ id: discountId });

        if (discountExist) {
            await this.delete({ id: discountId });
        } else throwError(404, 'Not found discount');
    }
}

module.exports = new DiscountService();
