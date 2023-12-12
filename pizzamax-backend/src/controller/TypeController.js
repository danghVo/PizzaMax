const { TypeService, ProductService } = require('../service');
const Controller = require('./Controller');

class TypeController extends Controller {
    constructor() {
        super('TypeController');
    }

    async getAll(req, res) {
        try {
            const types = await TypeService.getAllType();

            if (types) return res.json(types);
            else throwError(404, 'Nothing to show');
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async create(req, res, next) {
        try {
            await TypeService.createType(req.body);

            const types = await TypeService.getAllType();

            res.json(types);
            next();
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async update(req, res, next) {
        try {
            const typeId = { id: req.params.id };

            await TypeService.updateType(typeId, req.body);

            const types = await TypeService.getAllType();

            res.json(types);
            next();
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async delete(req, res, next) {
        try {
            const typeId = { id: req.params.id } || throwError(400, 'Missing type id');

            await ProductService.checkProductsOfTypeIsUse(typeId);

            await TypeService.deleteType(typeId);

            const types = await TypeService.getAllType();

            res.json(types);
            next();
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }
}

module.exports = new TypeController();
