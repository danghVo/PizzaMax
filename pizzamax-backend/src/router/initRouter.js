const router = require('express').Router();
const { ProductController, AddressController, BannerController, TypeController } = require('../controller');

router.get('/banner/getAll', BannerController.getAll);
router.get('/product/getAllProducts', ProductController.getAll);
router.get('/type/getAll', TypeController.getAll);
router.get('/address/getAllShopAddress', AddressController.getAllShop);
router.post('/address/currentLocation', AddressController.currentLocation);

module.exports.name = 'init';
module.exports.router = router;
