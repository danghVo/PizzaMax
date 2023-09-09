const router = require('express').Router();
const { AuthController } = require('../../controller');

router.get('/login', [AuthController.login, AuthController.createToken]);

router.get('/token', AuthController.refreshToken);

router.post('/logout', AuthController.deleteToken);

module.exports.name = 'auth';
module.exports.router = router;
