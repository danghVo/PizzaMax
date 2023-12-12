const router = require('express').Router();
const { UserController, AddressController, ProductController } = require('../controller');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/user/register', UserController.register);
router.get('/user/getInforByToken', UserController.getInforByToken);

router.all('/user/:uuid/*', UserController.checkUser);
router.patch('/user/:uuid/update', UserController.update);

router.post('/user/:uuid/createNewCart', UserController.createNewCart);

router.patch('/user/:uuid/addAvatar', [upload.single('image'), UserController.addAvatar]);

router.get('/user/:uuid/getAllAddress', AddressController.getAddressesOfUser);
router.post('/user/:uuid/addAddress', AddressController.createUserAddress);
router.patch('/user/:uuid/updateAddress/:addressId', AddressController.editAddress);
router.delete('/user/:uuid/deleteAddress/:addressId', AddressController.deleteAddress);

router.post('/user/:uuid/addFavor/:productId', ProductController.addFavor);
router.delete('/user/:uuid/removeFavor/:productId', ProductController.removeFavor);

module.exports.name = 'user';
module.exports.router = router;
