const router = require('express').Router();
const { ProductController } = require('../../controller');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const io = require('../../socket');

router.all('/product/*', upload.single('image'));
router.post('/product/create', [ProductController.create, () => io.emit('reFetch')]);
router.get('/product/get/:id', [ProductController.get, () => io.emit('reFetch')]);
router.get('/product/getAll', [ProductController.getAll, () => io.emit('reFetch')]);
router.patch('/product/update/:id', [ProductController.update, () => io.emit('reFetch')]);
router.patch('/product/toggleHide/:id', [ProductController.toggleHideProduct, () => io.emit('reFetch')]);

router.delete('/product/delete/:id', [ProductController.delete, () => io.emit('reFetch')]);
router.delete('/product/deleteSection/:id', [ProductController.deleteSectionByName, () => io.emit('reFetch')]);

module.exports.name = 'product';
module.exports.router = router;
