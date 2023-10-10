const router = require('express').Router();
const { CartController } = require('../controller');

router.all('/cart/:uuid/*', CartController.checkCart);

router.post('/cart/:uuid/addToCart', CartController.addToCart);
router.delete('/cart/:uuid/removeFromCart/:detailUUID', CartController.removeFromCart);
router.patch('/cart/:uuid/updateProduct/:detailUUID', CartController.updateProduct);
router.patch('/cart/:uuid/checkout', CartController.checkout);

module.exports.name = 'cart';
module.exports.router = router;
