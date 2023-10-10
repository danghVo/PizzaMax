const router = require('express').Router();
const { AddressController } = require('../../controller');

router.get('/address/getAll', AddressController.getAll);
router.post('/address/addAddress', AddressController.addAddress);
router.patch('/address/update/:id', AddressController.editAddress);
router.delete('/address/delete/:id', AddressController.deleteAddress);

module.exports.name = 'address';
module.exports.router = router;
