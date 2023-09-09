'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProductFlavor extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ Product, Flavor }) {
            this.belongsTo(Product, { foreignKey: 'productId' });
            this.belongsTo(Flavor, { foreignKey: 'sectionId' });
        }
    }
    ProductFlavor.init(
        {
            section: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
        },
        {
            sequelize,
            modelName: 'ProductFlavor',
        },
    );
    return ProductFlavor;
};
