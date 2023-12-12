const router = require('express').Router();
const { BannerController, CartController } = require('../../controller');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const io = require('../../socket');

router.get('/cart/getAll', CartController.getAllCart);
router.get('/cart/getAllDetail', CartController.getAllDetail);
router.patch('/cart/:uuid/updateStatus', [
    CartController.checkCart,
    CartController.updateCartStatus,
    () => io.emit('reFetch'),
]);

module.exports.name = 'cart';
module.exports.router = router;
