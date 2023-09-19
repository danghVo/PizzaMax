const throwError = require('../utils/throwError');
const { CartService } = require('../service');
const Controller = require('./Controller');

class CartController extends Controller {
    constructor() {
        super('CartController');
    }

    async addToCart(req, res) {
        try {
            const cartUUID = req.params.uuid;

            await CartService.addToCart(cartUUID, req.body);

            return res.send('Add product successfully');
        } catch (error) {
            return res.send(error?.message || error);
        }
    }
}

module.exports = new CartController();
