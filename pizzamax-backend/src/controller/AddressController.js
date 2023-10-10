const AddressService = require('../service/AddressService');
const throwError = require('../utils/throwError');

class AddressController {
    constructor() {
        this.controllerName = 'AddressController';
    }

    async getAll(req, res) {
        try {
            const addresses = await AddressService.getAll();

            return res.json(addresses);
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async getAllShop(req, res) {
        try {
            const addresses = await AddressService.getAllShop();

            return res.json(addresses);
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async getAddressesOfUser(req, res) {
        try {
            const user = res.locals.user;
            const addresses = await AddressService.getAllAddressOfUser(user);

            return res.json(addresses);
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async addAddress(req, res) {
        try {
            const user = res.locals.user || 'admin';

            const address = await AddressService.createAddress(user, req.body);

            return res.json(address);
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async editAddress(req, res) {
        try {
            const addressId = req.params.addressId;

            const address = await AddressService.updateAddress(addressId, req.body);

            res.json(address);
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async deleteAddress(req, res) {
        try {
            const addressId = req.params.addressId;

            await AddressService.deleteAddress(addressId);

            res.status(200).send('Deleted address successfully');
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }
}

module.exports = new AddressController();
