const router = require('express').Router();
const { ProductController, AddressController } = require('../controller');

router.get('/product/getAll', ProductController.getAll);
router.get('/address/getAllShop', AddressController.getAllStore);

module.exports.name = 'init';
module.exports.router = router;
