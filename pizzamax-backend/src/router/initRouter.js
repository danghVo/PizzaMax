const router = require('express').Router();
const { ProductController, AddressController } = require('../controller');

router.get('/product/getAllProducts', ProductController.getAll);
router.get('/address/getAllShopAddress', AddressController.getAllShop);

module.exports.name = 'init';
module.exports.router = router;
