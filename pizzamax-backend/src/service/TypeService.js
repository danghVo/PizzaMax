const { Type, Time } = require('../models');
const TimeService = require('./TimeService');
const Service = require('./Service');
const throwError = require('../utils/throwError');

class TypeService extends Service {
    constructor() {
        super('TypeService', Type);
    }

    form(payload, mustFull = true) {
        const type = {
            name: payload?.name,
        };

        Object.keys(type).forEach((key) => {
            type[key] || (mustFull ? throwError(400, `Missing field: ${key}`) : delete type[key]);
        });

        return type;
    }

    async getAllType() {
        return await this.getAll(Time);
    }

    async createType({ timeId, ...payload }) {
        if (timeId) {
            const isTimeExist = await TimeService.find({ id: timeId });

            if (!isTimeExist) {
                throwError(404, 'Time with id does not exist');
            }
        }

        const type = this.form(payload);
        const isExist = await this.find(type);

        if (isExist) {
            throwError(409, 'Đã tồn tại ');
        } else return await this.model.create({ ...type, timeId: timeId && 2 });
    }

    async updateType(typeId, { timeId, ...payload }) {
        if (timeId) {
            const isTimeExist = await TimeService.find({ id: timeId });

            if (!isTimeExist) {
                throwError(404, 'Time with id does not exist');
            }
        }

        const type = this.form(payload, false);

        if (!type && !timeId) {
            throwError(400, 'Updated value wasnt provided');
        }

        const isExist = await this.find(typeId);

        if (isExist) {
            await this.update(typeId, Object.assign(type, timeId && { timeId }));
        } else throwError(404, 'Không tồn tại');
    }

    async deleteType(typeId) {
        const isExist = await this.find(typeId);

        if (isExist) {
            return await this.delete(typeId);
        } else throwError(404, 'Không tồn tại');
    }
}

module.exports = new TypeService();
