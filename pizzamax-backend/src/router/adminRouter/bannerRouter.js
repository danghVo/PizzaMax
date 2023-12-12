const router = require('express').Router();
const { BannerController } = require('../../controller');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const io = require('../../socket');

router.all('/banner/*', upload.single('image'));

router.post('/banner/create', [BannerController.add, () => io.emit('reFetch')]);
router.patch('/banner/:id/update', [BannerController.update, () => io.emit('reFetch')]);
router.delete('/banner/:id/delete', [BannerController.delete, () => io.emit('reFetch')]);

module.exports.name = 'banner';
module.exports.router = router;
