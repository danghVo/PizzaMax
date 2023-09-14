const router = require('express').Router();
const { CartController } = require('../controller');

router.post('/cart/:uuid/addToCart', CartController.addToCart);
router.post('/cart/:uuid/removeFromCart', CartController.removeFromCart);
router.patch('/cart/:uuid/updateProduct', CartController.updateProduct);
router.post('/cart/:uuid/checkout', CartController.checkout);

module.exports.name = 'cart';
module.exports.router = router;
