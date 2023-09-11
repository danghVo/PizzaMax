const router = require('express').Router();
const { UserController } = require('../controller');

router.post('/user/register', UserController.register);

router.post('/user/changePassword', UserController.changePassword);
router.post('/user/changeName', UserController.changeName);

module.exports.name = 'user';
module.exports.router = router;
