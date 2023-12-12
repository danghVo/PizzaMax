const { AddressUser } = require('../models');

const Service = require('./Service');

class AddressUserService extends Service {
    constructor() {
        super('AddressUserService', AddressUser);
    }
}

module.exports = new AddressUserService();
