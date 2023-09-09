const router = require('express').Router();
const { TimeController } = require('../../controller');

router.get('/time/getAll', TimeController.getAll);
router.post('/time/create', TimeController.create);
router.patch('/time/update/:id', TimeController.update);
router.delete('/time/delete/:id', TimeController.delete);

module.exports.name = 'time';
module.exports.router = router;
