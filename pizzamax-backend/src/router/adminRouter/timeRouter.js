const router = require('express').Router();
const { TimeController } = require('../../controller');
const io = require('../../socket');

router.get('/time/getAll', [TimeController.getAll, () => io.emit('reFetch')]);
router.post('/time/create', [TimeController.create, () => io.emit('reFetch')]);
router.patch('/time/update/:id', [TimeController.update, () => io.emit('reFetch')]);
router.delete('/time/delete/:id', [TimeController.delete, () => io.emit('reFetch')]);

module.exports.name = 'time';
module.exports.router = router;
