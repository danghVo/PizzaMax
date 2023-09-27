const throwError = require('../utils/throwError');
const { CartService } = require('../service');
const Controller = require('./Controller');

class CartController extends Controller {
    constructor() {
        super('CartController');
    }

    async checkCart(req, res, next) {
        try {
            const cartUUID = req.params.uuid;

            const cart = await CartService.getCart(cartUUID);

            res.locals.cart = cart;
            next();
        } catch (error) {
            return res.status(error.status || 500).send(error.message || error);
        }
    }

    async addToCart(req, res) {
        try {
            const cart = res.locals.cart;

            await CartService.addToCart(cart, req.body);

            return res.send('Add product successfully');
        } catch (error) {
            return res.status(error.status || 500).send(error.message || error);
        }
    }

    async removeFromCart(req, res) {
        try {
            await CartService.removeFromCart(req.body);

            return res.send('Remove product successfully');
        } catch (error) {
            return res.status(error.status || 500).send(error.message || error);
        }
    }

    async updateProduct(req, res) {
        try {
            await CartService.updateProduct(req.body);

            return res.send('Update product successfully');
        } catch (error) {
            return res.status(error.status || 500).send(error.message || error);
        }
    }

    async checkout(req, res) {
        try {
            const cart = res.locals.cart;

            const message = await CartService.checkout(cart, req.body);

            return res.send(message);
        } catch (error) {
            return res.status(error.status || 500).send(error.message || error);
        }
    }
}

module.exports = new CartController();
