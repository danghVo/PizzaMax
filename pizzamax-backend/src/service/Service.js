class Service {
    model;
    juncModel;

    constructor(name, model = null, juncModel = null) {
        this.serviceName = name;
        this.model = model;
        this.juncModel = juncModel;
    }

    async create(payload, include) {
        return await this.model.create(payload, include && { include });
    }

    async getAll(subModel = {}) {
        return await this.model.findAll({ include: subModel });
    }

    async getAllBy(filter, subModel = undefined) {
        return await this.model.findAll({ where: filter, include: subModel });
    }

    async find(filter, subModel = undefined) {
        return await this.model.findOne({ where: filter, include: subModel });
    }

    async findJunc(filter, subModel = undefined) {
        return await this.juncModel.findOne({ where: filter, include: subModel });
    }

    async deleteJunc(filter, subModel = undefined) {
        return await this.juncModel.destroy({ where: filter, include: subModel });
    }

    async update(filter, update, subModel = undefined) {
        return await this.model.update(update, { where: filter, include: subModel });
    }

    async delete(filter, subModel = undefined) {
        return await this.model.destroy({ where: filter, include: subModel });
    }
}

module.exports = Service;
