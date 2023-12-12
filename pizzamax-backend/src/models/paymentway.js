'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PaymentWay extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ Cart }) {
            this.hasMany(Cart);
        }
    }
    PaymentWay.init(
        {
            name: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'PaymentWay',
            timestamps: false,
        },
    );
    return PaymentWay;
};
