const { Time } = require('../models');
const Service = require('./Service');
const throwError = require('../utils/throwError');

class TimeService extends Service {
    constructor() {
        super('TimeService', Time);
    }

    form(payload, mustFull = true) {
        const time = {
            name: payload?.name,
            fromDay: payload?.fromDay,
            toDay: payload?.toDay,
            fromTime: payload?.fromTime,
            toTime: payload?.toTime,
        };

        Object.keys(time).forEach((key) => {
            time[key] || (mustFull ? throwError(400, `Missing field: ${key}`) : delete time[key]);
        });

        return time;
    }

    async getAllTime() {
        return await this.getAll();
    }

    async createTime(payload) {
        const time = this.form(payload);
        const isExist = await this.find(time);

        if (isExist) {
            throwError(409, 'Đã tồn tại thời gian này');
        } else return await this.create(time);
    }

    async updateTime(timeId, payload) {
        const time = this.form(payload, false);
        const isExist = await this.find(timeId);

        if (isExist) {
            await this.update(timeId, time);
        } else throwError(500, 'Update fail');
    }

    async deleteTime(timeId, TypeService) {
        const isExist = await this.find(timeId);

        if (isExist) {
            const isTypeHaveTime = await TypeService.find(timeId);
            if (isTypeHaveTime) throwError(409, 'Thời gian đang được sử dụng');
            else return await this.delete(timeId);
        } else throwError(404, 'Time doesnt exist');
    }
}

module.exports = new TimeService();
