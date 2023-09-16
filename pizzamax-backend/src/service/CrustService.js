const { Crust, ProductCrust } = require('../models');

const SectionService = require('./SectionService');

class CrustService extends SectionService {
    constructor() {
        super('CrustService', Crust, ProductCrust);
    }
}

module.exports = new CrustService();
