'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ User, Detail, Product }) {
            this.belongsTo(User, { foreignKey: 'cartId' });
            this.belongsToMany(Product, { through: Detail, foreignKey: 'cartId' });
        }
    }
    Cart.init(
        {
            uuid: {
                type: DataTypes.UUID,
                allowNull: false,
                defaultValue: DataTypes.UUIDV4,
            },
            deliveryCharge: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: '15.000',
            },
            subTotal: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            total: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Cart',
        },
    );
    return Cart;
};
