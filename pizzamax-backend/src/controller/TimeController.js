const throwError = require('../Helper/throwError');
const { TimeService } = require('../service');
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
            return res.send(error?.message || error);
        }
    }

    async create(req, res) {
        try {
            await TimeService.createTime(req.body);

            return res.send('Time is created successfuly');
        } catch (error) {
            return res.send(error?.message || error);
        }
    }

    async update(req, res) {
        try {
            const timeId = req.params;

            await TimeService.updateTime(timeId, req.body);

            return res.send('Time is updated successfully');
        } catch (error) {
            return res.send(error?.message || error);
        }
    }

    async delete(req, res) {
        try {
            const timeId = req.params || throwError(400, 'Missing time id');

            await TimeService.deleteTime(timeId);

            return res.send('Time id deleted successfully');
        } catch (error) {
            return res.send(error?.message || error);
        }
    }
}

module.exports = new TimeController();
