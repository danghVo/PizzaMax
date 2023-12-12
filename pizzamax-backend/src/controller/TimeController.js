const throwError = require('../utils/throwError');
const { TimeService, TypeService } = require('../service');
const Controller = require('./Controller');

class TimeController extends Controller {
    constructor() {
        super('TimeController');
    }

    async getAll(req, res) {
        try {
            const times = await TimeService.getAllTime();

            if (times) return res.json(times);
            else throwError(404, 'Nothing to show');
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async create(req, res, next) {
        try {
            await TimeService.createTime(req.body);

            const times = await TimeService.getAllTime();
            res.json(times);
            next();
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async update(req, res, next) {
        try {
            const timeId = req.params;

            await TimeService.updateTime(timeId, req.body);
            const times = await TimeService.getAllTime();
            res.json(times);
            next();
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async delete(req, res, next) {
        try {
            const timeId = req.params || throwError(400, 'Missing time id');

            await TimeService.deleteTime(timeId, TypeService);

            const times = await TimeService.getAllTime();
            res.json(times);
            next();
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }
}

module.exports = new TimeController();
