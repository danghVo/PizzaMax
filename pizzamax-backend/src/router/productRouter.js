const router = require('express').Router();
const { ProductController } = require('../controller');

router.get('/product/getAll', ProductController.getAll);

module.exports.name = 'product';
module.exports.router = router;
