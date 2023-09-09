const router = require('express').Router();
const { ProductController } = require('../../controller');

router.post('/product/create', ProductController.create);
router.get('/product/get/:id', ProductController.get);
router.get('/product/getAll', ProductController.getAll);
router.patch('/product/update/:id', ProductController.update);

router.delete('/product/delete/:id', ProductController.delete);
router.delete('/product/deleteSection/:id', ProductController.deleteSectionByName);

module.exports.name = 'product';
module.exports.router = router;
