const router = require('express').Router();
const { AddressController } = require('../../controller');
const io = require('../../socket');

router.get('/address/getAll', AddressController.getAll);
router.post('/address/addAddress', [AddressController.createStoreAddress, () => io.emit('reFetch')]);
router.patch('/address/update/:addressId', [AddressController.editAddress, () => io.emit('reFetch')]);
router.delete('/address/delete/:addressId', [AddressController.deleteAddress, () => io.emit('reFetch')]);

module.exports.name = 'address';
module.exports.router = router;
