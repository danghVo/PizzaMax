const router = require('express').Router();
const { VNPayController } = require('../controller');

router.get('/vnpayResult', VNPayController.checkResult);

module.exports.name = 'vnpay';
module.exports.router = router;
