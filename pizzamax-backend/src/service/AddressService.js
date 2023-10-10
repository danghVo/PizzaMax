const { Address, User, City } = require('../models');

const Service = require('./Service');
const CityService = require('./CityService');
const throwError = require('../utils/throwError');

class AddressService extends Service {
    constructor() {
        super('AddressService', Address);
    }

    form(payload, mustFull = true, type) {
        const address = {
            type,
            street: payload?.street,
            district: payload?.district,
            houseNumber: payload?.houseNumber,
        };

        Object.keys(address).forEach((key) => {
            address[key] || (mustFull ? throwError(400, `Missing ${key}`) : delete address[key]);
        });

        return { ...address, description: payload.description || '', alley: parseInt(payload.alley) || null };
    }

    async getAll() {
        return await this.getAll({ User, City });
    }

    async getAllAddressOfUser(user) {
        return await this.getAllBy({ userId: user.id }, [City]);
    }

    async getAllShop() {
        const addresses = await this.getAllBy({ type: 'store' }, [City]);

        return addresses;
    }

    async createAddress(user, payload) {
        const addressForm = this.form(payload, true, user == 'admin' ? 'store' : 'user');
        const city = await CityService.find({ name: payload.city });

        if (!city) {
            return throwError(404, 'City not found');
        }

        const address = {
            ...addressForm,
            userId: user === 'admin' ? 1 : user.id,
            cityId: city.id,
        };

        const addressExist = await this.find(address);
        if (!addressExist) return await this.model.create(address);
        else return throwError(409, 'Address exist');
    }

    async updateAddress(addressId, payload) {
        const address = await this.find({ id: addressId });

        if (address) {
            const city = await CityService.find({ name: payload.city });
            const addressForm = this.form(payload, false, address.type);
            return await this.update({ id: addressId }, { ...addressForm, cityId: city.id });
        } else throwError(404, 'Not found Address');
    }

    async deleteAddress(addressId) {
        const address = await this.find({ id: addressId });

        if (address) {
            await this.delete({ id: addressId });
        } else throwError(404, 'Not found Address');
    }
}

module.exports = new AddressService();
