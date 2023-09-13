'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class City extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ Address, User }) {
            this.belongsToMany(User, { through: Address, foreignKey: 'cityId' });
        }
    }
    City.init(
        {
            name: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'City',
        },
    );
    return City;
};
