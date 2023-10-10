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
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async addToCart(req, res) {
        try {
            const cart = res.locals.cart;
            const newCart = await CartService.addToCart(cart, req.body);

            return res.json(newCart);
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async removeFromCart(req, res) {
        try {
            const cart = res.locals.cart;
            const detailUUID = req.params.detailUUID;

            const newCart = await CartService.removeFromCart(cart, detailUUID);

            return res.json(newCart);
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async updateProduct(req, res) {
        try {
            const cart = res.locals.cart;
            const detailUUID = req.params.detailUUID;

            const newCart = await CartService.updateProduct(cart, detailUUID, req.body);

            return res.json(newCart);
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async checkout(req, res) {
        try {
            const cart = res.locals.cart;

            const message = await CartService.checkout(cart, req.body);

            return res.send(message);
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }
}

module.exports = new CartController();
