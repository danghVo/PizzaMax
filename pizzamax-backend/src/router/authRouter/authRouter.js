const router = require('express').Router();
const { AuthController } = require('../../controller');

router.post('/login', [AuthController.login, AuthController.createToken]);

router.post('/token', AuthController.refreshToken);

router.post('/logout', AuthController.deleteToken);

module.exports.name = 'auth';
module.exports.router = router;
