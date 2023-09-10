const { Type, Time } = require('../models');
const Service = require('./Service');
const throwError = require('../utils/throwError');

class TypeService extends Service {
    constructor() {
        super('TypeService');
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
        return await this.getAll(Type, 'Time');
    }

    async createType({ timeId, ...payload }) {
        if (timeId) {
            const isTimeExist = await this.find(Time, { id: timeId });

            if (!isTimeExist) {
                throwError(404, 'Time with id does not exist');
            }
        }

        const type = this.form(payload);
        const isExist = await this.find(Type, type);

        if (isExist) {
            throwError(409, 'Type has already existed');
        } else return await Type.create({ ...type, timeId: timeId && 2 });
    }

    async updateType(typeId, { timeId, ...payload }) {
        if (timeId) {
            const isTimeExist = await this.find(Time, { id: timeId });

            if (!isTimeExist) {
                throwError(404, 'Time with id does not exist');
            }
        }

        const type = this.form(payload, false);

        if (!type && !timeId) {
            throwError(400, 'Updated value wasnt provided');
        }

        const isExist = await this.find(Type, typeId);

        if (isExist) {
            await this.update(Type, typeId, Object.assign(type, timeId && { timeId }));
        } else throwError(500, 'Update fail');
    }

    async deleteType(typeId) {
        const isExist = await this.find(Type, typeId);

        if (isExist) return await this.delete(Type, typeId);
        else throwError(404, 'Type doesnt exist');
    }
}

module.exports = new TypeService();
