'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class City extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ Address }) {
            this.hasMany(Address);
        }
    }
    City.init(
        {
            name: DataTypes.STRING,
        },
        {
            timestamps: false,
            sequelize,
            modelName: 'City',
        },
    );
    return City;
};
