const router = require('express').Router();
const { AuthController, UserController } = require('../../controller');

router.post('/login', [AuthController.login, UserController.getUserInfor, AuthController.createToken]);

router.get('/refreshToken', AuthController.refreshToken);

router.get('/logout', AuthController.deleteToken);

module.exports.name = 'auth';
module.exports.router = router;
