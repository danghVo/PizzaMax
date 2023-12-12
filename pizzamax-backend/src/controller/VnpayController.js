const { VNPayService } = require('../service');
const Controller = require('./Controller');
const io = require('../socket');
const CartService = require('../service/CartService');

class VNPayController extends Controller {
    constructor() {
        super('VNPayController');
    }

    async checkResult(req, res) {
        res.status(200).send('<script> window.close() </script>');

        try {
            const query = req.query;

            const result = await VNPayService.checkResult(CartService);
            if (result.status) io.emit('vnp_success', result);
            else io.emit('vnp_fail', err.message);
        } catch (err) {
            io.emit('vnp_fail', err.message);
        }
    }
}

module.exports = new VNPayController();
