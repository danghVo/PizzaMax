const { AddressStore, Address, City } = require('../models');

const Service = require('./Service');

class AddressStoreService extends Service {
    constructor() {
        super('AddressStoreService', AddressStore);
    }

    async getAllStore() {
        const addresseStore = await this.getAll([
            {
                model: Address,
                include: [City],
            },
        ]);

        return addresseStore;
    }
}

module.exports = new AddressStoreService();
