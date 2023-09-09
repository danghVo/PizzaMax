'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Discount extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.hasMany(models.Product, {
                foreignKey: 'discountId',
            });

            this.belongsTo(models.Time);
        }
    }
    Discount.init(
        {
            saleoff: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Discount',
        },
    );
    return Discount;
};
