const router = require('express').Router();
const { UserController } = require('../../controller');

router.get('/user/getAll', UserController.getAllUser);
router.patch('/user/update/:id', UserController.updateUser);
router.delete('/user/delete/:id', UserController.deleteUser);
router.post('/user/createAdmin', UserController.createAdmin);

module.exports.name = 'user';
module.exports.router = router;
