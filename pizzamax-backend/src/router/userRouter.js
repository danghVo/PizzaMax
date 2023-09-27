const router = require('express').Router();
const { UserController, AddressController, ProductController } = require('../controller');

router.post('/user/register', UserController.register);
router.get('/user/getInforByToken', UserController.getInforByToken);

router.all('/user/:uuid/*', UserController.checkUser);

router.patch('/user/:uuid/changePassword', UserController.changePassword);
router.patch('/user/:uuid/update', UserController.updateUser);

router.post('/user/:uuid/newAddress', AddressController.newAddress);
router.patch('/user/:uuid/editAddress/:addressId', AddressController.editAddress);
router.delete('/user/:uuid/deleteAddress/:addressId', AddressController.deleteAddress);

router.post('/user/:uuid/addFavor/:productId', ProductController.addFavor);
router.delete('/user/:uuid/removeFavor/:productId', ProductController.removeFavor);

module.exports.name = 'user';
module.exports.router = router;
