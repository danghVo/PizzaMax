const { City } = require('../models');

const Service = require('./Service');

class CityService extends Service {
    constructor() {
        super('CityService', City);
    }
}

module.exports = new CityService();
