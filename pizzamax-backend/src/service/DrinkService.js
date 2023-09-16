const { Drink, ProductDrink } = require('../models');

const SectionService = require('./SectionService');

class DrinkService extends SectionService {
    constructor() {
        super('DrinkService', Drink, ProductDrink);
    }
}

module.exports = new DrinkService();
