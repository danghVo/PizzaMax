class Service {
    constructor(name) {
        this.serviceName = name;
    }

    form(payload, mustFull = true) {}

    async getAll(model, subModel = undefined, filter = undefined) {
        return await model.findAll(subModel && { include: subModel, where: filter });
    }

    async find(model, filter) {
        return await model.findOne({ where: filter });
    }

    async update(model, filter, update, include) {
        return await model.update(update, { where: filter }, include);
    }

    async delete(model, filter) {
        return await model.destroy({ where: filter });
    }
}

module.exports = Service;
