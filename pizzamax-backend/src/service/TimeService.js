const { Time } = require('../models');
const Service = require('./Service');
const throwError = require('../utils/throwError');

class TimeService extends Service {
    constructor() {
        super('TimeService');
    }

    form(payload, mustFull = true) {
        const time = {
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
        return await this.getAll(Time);
    }

    async createTime(payload) {
        const time = this.form(payload);
        const isExist = await this.find(Time, time);

        if (isExist) {
            throwError(409, 'Time has already existed');
        } else return await Time.create(time);
    }

    async updateTime(timeId, payload) {
        const time = this.form(payload, false);
        const isExist = await this.find(Time, timeId);

        if (isExist) {
            await this.update(Time, timeId, time);
        } else throwError(500, 'Update fail');
    }

    async deleteTime(timeId) {
        const isExist = await this.find(Time, timeId);

        if (isExist) return await this.delete(Time, timeId);
        else throwError(404, 'Time doesnt exist');
    }
}

module.exports = new TimeService();
