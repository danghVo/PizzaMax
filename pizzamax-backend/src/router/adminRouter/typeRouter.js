const router = require('express').Router();
const { TypeController } = require('../../controller');
const io = require('../../socket');

router.post('/type/create', [TypeController.create, () => io.emit('reFetch')]);
router.patch('/type/update/:id', [TypeController.update, () => io.emit('reFetch')]);
router.delete('/type/delete/:id', [TypeController.delete, () => io.emit('reFetch')]);

module.exports.name = 'type';
module.exports.router = router;
