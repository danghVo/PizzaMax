const router = require('express').Router();
const { TypeController } = require('../../controller');

router.get('/type/getAll', TypeController.getAll);
router.post('/type/create', TypeController.create);
router.patch('/type/update/:id', TypeController.update);
router.delete('/type/delete/:id', TypeController.delete);

module.exports.name = 'type';
module.exports.router = router;
