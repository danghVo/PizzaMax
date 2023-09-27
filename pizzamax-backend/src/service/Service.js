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
        return await this.model.findAll({ where: filter }, subModel && { include: subModel });
    }

    async find(filter, include = {}) {
        return await this.model.findOne({ where: filter }, include);
    }

    async findJunc(filter, include = {}) {
        return await this.juncModel.findOne({ where: filter }, include);
    }

    async deleteJunc(filter, include) {
        return await this.juncModel.destroy({ where: filter }, include);
    }

    async update(filter, update, include) {
        return await this.model.update(update, { where: filter }, include);
    }

    async delete(filter, include = {}) {
        return await this.model.destroy({ where: filter }, include);
    }
}

module.exports = Service;
