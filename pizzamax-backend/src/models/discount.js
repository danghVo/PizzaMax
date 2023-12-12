'use strict';
const { Model } = require('sequelize');
const moment = require('moment');
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
        }

        toJSON() {
            const discount = this.get();
            delete discount.createdAt;
            delete discount.updatedAt;

            return {
                ...discount,
                startAt: moment.utc(discount.startAt).local().format('YYYY-MM-DD HH:mm:ss'),
                endAt: moment.utc(discount.endAt).local().format('YYYY-MM-DD HH:mm:ss'),
            };
        }
    }
    Discount.init(
        {
            saleOff: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            startAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            endAt: {
                type: DataTypes.DATE,
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
