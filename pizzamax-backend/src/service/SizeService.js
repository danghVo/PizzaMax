const { Size, ProductSize } = require('../models');

const SectionService = require('./SectionService');

class SizeService extends SectionService {
    constructor() {
        super('SizeService', Size, ProductSize);
    }
}

module.exports = new SizeService();
