const { TypeService } = require('../service');
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
            return res.status(error.status || 500).send(error.message || error);
        }
    }

    async create(req, res) {
        try {
            await TypeService.createType(req.body);

            return res.send('Type is created successfuly');
        } catch (error) {
            return res.status(error.status || 500).send(error.message || error);
        }
    }

    async update(req, res) {
        try {
            const typeId = { id: req.params.id };

            await TypeService.updateType(typeId, req.body);

            return res.send('Type is updated successfully');
        } catch (error) {
            return res.status(error.status || 500).send(error.message || error);
        }
    }

    async delete(req, res) {
        try {
            const typeId = { id: req.params.id } || throwError(400, 'Missing type id');

            await TypeService.deletetype(typeId);

            return res.send('Type id deleted successfully');
        } catch (error) {
            return res.status(error.status || 500).send(error.message || error);
        }
    }
}

module.exports = new TypeController();
