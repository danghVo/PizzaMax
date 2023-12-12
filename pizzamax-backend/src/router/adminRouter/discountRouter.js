const router = require('express').Router();
const { DiscountController } = require('../../controller');
const io = require('../../socket');

router.get('/discount/getAll', DiscountController.getAll);
router.post('/discount/create', DiscountController.createDiscount);
router.patch('/discount/update/:id', [DiscountController.updateDiscount, () => io.emit('reFetch')]);
router.delete('/discount/delete/:id', DiscountController.deleteDiscount);

module.exports.name = 'discount';
module.exports.router = router;
