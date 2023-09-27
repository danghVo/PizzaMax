const { Favorite } = require('../models');

const Service = require('./Service');

class FavoriteService extends Service {
    constructor() {
        super('FavoriteService', Favorite);
    }
}

module.exports = new FavoriteService();
