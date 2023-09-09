'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProductDrink extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ Product, Drink }) {
            this.belongsTo(Product, { foreignKey: 'productId' });
            this.belongsTo(Drink, { foreignKey: 'sectionId' });
        }
    }
    ProductDrink.init(
        {
            section: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'ProductDrink',
        },
    );
    return ProductDrink;
};
