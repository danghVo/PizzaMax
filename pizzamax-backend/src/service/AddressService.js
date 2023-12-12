const { Address, User, City } = require('../models');

const Service = require('./Service');
const CityService = require('./CityService');
const AddressStoreService = require('./AddressStoreService');
const AddressUserService = require('./AddressUserService');
const throwError = require('../utils/throwError');
const addressTransform = require('../utils/addressTransform');
const GoogleAddressService = require('./GoogleAddressService');

class AddressService extends Service {
    constructor() {
        super('AddressService', Address);
    }

    form(payload, mustFull = true) {
        const address = {
            street: payload?.street,
            district: payload?.district,
            houseNumber: payload?.houseNumber,
        };

        Object.keys(address).forEach((key) => {
            address[key] || (mustFull ? throwError(400, `Missing ${key}`) : delete address[key]);
        });

        return { ...address, alley: parseInt(payload.alley) || null, ward: parseInt(payload.ward) || null };
    }

    async getAll() {
        return await this.getAll({ User, City });
    }

    async getAllAddressOfUser(user) {
        return await AddressUserService.getAllBy({ userId: user.id }, [
            {
                model: Address,
                include: [City],
            },
        ]);
    }

    async getAllShop() {
        const addresses = await AddressStoreService.getAllStore();

        return addresses;
    }

    async getDistance(addressId) {
        const addressExist = await this.find({ id: addressId });

        if (addressExist) {
            let storeAddresses = await this.getAllShop();

            storeAddresses = storeAddresses.map((storeAddress) => addressTransform(storeAddress.Address)).join('|');

            let distances = await GoogleAddressService.distanceMaxtrix(addressTransform(addressExist), storeAddresses);
            if (distances.length === 0) {
                return null;
            }

            distances = distances.sort((a, b) => a.elements[0].distance.value - b.elements[0].distance.value);

            return parseFloat(distances[0].elements[0].distance.value) / 1000;
        } else {
            throwError(404, 'Address doesnt existed');
        }
    }

    async currentLocation(payload) {
        if (!payload.latitude || !payload.longitude) {
            return throwError(409, 'Missing latitude or longtitude');
        }

        const address = await GoogleAddressService.convertLatLngToAddress(payload.latitude, payload.longitude);

        return address;
    }

    async createUserAddress(user, payload) {
        const addressForm = this.form(payload);
        const city = await CityService.find({ name: payload.city });

        if (!city) {
            return throwError(404, 'City not found');
        }

        const address = {
            ...addressForm,
            cityId: city.id,
        };

        const checkAddressExist = await this.checkAddressOfUserExist(user, address);

        if (checkAddressExist) {
            return throwError(409, 'Địa chỉ đã tồn tại');
        }

        const newAddress = await this.create({ ...address });
        return AddressUserService.create({ userId: user.id, addressId: newAddress.id });
    }

    async checkAddressOfUserExist(user, address) {
        const getAllAddressOfUser = await this.getAllAddressOfUser(user);
        return getAllAddressOfUser.find(
            (addressOfUser) =>
                addressOfUser.Address.street === address.street &&
                addressOfUser.Address.district === address.district &&
                addressOfUser.Address.houseNumber === address.houseNumber &&
                addressOfUser.Address.alley === address.alley &&
                addressOfUser.Address.ward === address.ward &&
                addressOfUser.Address.cityId === address.cityId,
        );
    }

    async createStoreAddress(payload) {
        const addressForm = this.form(payload);
        const city = await CityService.find({ name: payload.city });

        if (!city) {
            return throwError(404, 'City not found');
        }

        const address = {
            ...addressForm,
            cityId: city.id,
        };

        const newAddress = await this.create({ ...address });
        return AddressStoreService.create({ addressId: newAddress.id });
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

    async deleteUserAddress(user, addressId) {
        await AddressUserService.delete({ userId: user.id, addressId: addressId });
    }

    async deleteStoreAddress(addressId) {
        await AddressStoreService.delete({ addressId: addressId });
    }
}

module.exports = new AddressService();
