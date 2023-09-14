const router = require('express').Router();
const { UserController } = require('../controller');

router.post('/user/register', UserController.register);
router.patch('/user/changePassword/:uuid', UserController.changePassword);
router.patch('/user/update/:uuid', UserController.updateUser);

module.exports.name = 'user';
module.exports.router = router;
