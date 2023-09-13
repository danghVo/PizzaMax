'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Detail extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ Cart, Product }) {
            this.belongsTo(Product, { foreignKey: 'productId' });
            this.belongsTo(Cart, { foreignKey: 'cartId' });
        }
    }
    Detail.init(
        {
            quantity: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Detail',
        },
    );
    return Detail;
};
