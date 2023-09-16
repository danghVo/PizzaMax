const { Flavor, ProductFlavor } = require('../models');

const SectionService = require('./SectionService');

class FlavorService extends SectionService {
    constructor() {
        super('FlavorService', Flavor, ProductFlavor);
    }
}

module.exports = new FlavorService();
