const throwError = require('../utils/throwError');
const { CartService } = require('../service');
const Controller = require('./Controller');

class CartController extends Controller {
    constructor() {
        super('CartController');
    }
}

module.exports = new CartController();
