const { Discount, User, City } = require('../models');

const Service = require('./Service');
const CityService = require('./CityService');
const moment = require('moment');
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

    async getAll() {
        return await this.getAll();
    }

    checkDate(startAt, endAt) {
        const checkStartAt = new Date(startAt).valueOf();
        const checkEndAt = new Date(endAt).valueOf();
        const now = Date.now();

        if (checkStartAt < now || checkEndAt < now || checkStartAt > checkEndAt) {
            throwError(400, 'Wrong date');
        }

        return true;
    }

    async createDiscount(payload) {
        const discountForm = this.form(payload);

        if (this.checkDate(discountForm.startAt, discountForm.endAt)) {
            const discoutExist = await this.find(discountForm);
            if (!discoutExist) return await this.model.create(discountForm);
            else return throwError(409, 'Discount exist');
        }
    }

    async updateDiscount(discountId, payload) {
        const discountExist = await this.find({ id: discountId });
        if (discountExist) {
            const startAt = payload.startAt || discountExist.getDataValue('startAt');
            const endAt = payload.endAt || discountExist.getDataValue('endAt');

            if (this.checkDate(startAt, endAt)) {
                Object.keys(payload).forEach((key) => {
                    if (discountExist[key]) {
                        discountExist[key] = payload[key];
                    } else throwError(409, 'Not have ' + key + ' property');
                });
            }

            await discountExist.save();
            return discountExist;
        } else return throwError(404, 'Discount not exist');
    }

    async deleteAddress(discountId) {
        const discountExist = await this.find({ id: discountId });

        if (discountExist) {
            await this.delete({ id: discountId });
        } else throwError(404, 'Not found discount');
    }
}

module.exports = new DiscountService();
