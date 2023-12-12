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

    async createUserAddress(req, res) {
        try {
            const user = res.locals.user;
            await AddressService.createUserAddress(user, req.body);

            const addresses = await AddressService.getAllAddressOfUser(user);

            return res.json(addresses);
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async createStoreAddress(req, res, next) {
        try {
            await AddressService.createStoreAddress(req.body);

            const addresses = await AddressService.getAllShop();

            res.json(addresses);
            next();
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async editAddress(req, res, next) {
        try {
            const addressId = req.params.addressId;
            const path = req.baseUrl;

            await AddressService.updateAddress(addressId, req.body);

            if (path.includes('admin')) {
                const addresses = await AddressService.getAllShop();

                res.json(addresses);
                next();
            } else {
                const user = res.locals.user;
                const addresses = await AddressService.getAllAddressOfUser(user);

                return res.json(addresses);
            }
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async deleteAddress(req, res, next) {
        try {
            const addressId = req.params.addressId;
            const path = req.baseUrl;

            await AddressService.deleteAddress(addressId);

            if (path.includes('admin')) {
                await AddressService.deleteStoreAddress(addressId);
                const addresses = await AddressService.getAllShop();

                res.json(addresses);
                next();
            } else {
                const user = res.locals.user;
                await AddressService.deleteUserAddress(user, addressId);
                const addresses = await AddressService.getAllAddressOfUser(user);

                return res.json(addresses);
            }
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async currentLocation(req, res) {
        try {
            const address = await AddressService.currentLocation(req.body);

            return res.json(address);
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }
}

module.exports = new AddressController();
