class Service {
    model;
    juncModel;

    constructor(name, model = null, juncModel = null) {
        this.serviceName = name;
        this.model = model;
        this.juncModel = juncModel;
    }

    form(payload, mustFull = true) {}

    async getAll(subModel = undefined, filter = undefined) {
        return await this.model.findAll(subModel && { include: subModel, where: filter });
    }

    async find(filter, include = {}) {
        return await this.model.findOne({ where: filter }, include);
    }

    async update(filter, update, include) {
        return await this.model.update(update, { where: filter }, include);
    }

    async delete(filter) {
        return await this.model.destroy({ where: filter });
    }
}

module.exports = Service;
