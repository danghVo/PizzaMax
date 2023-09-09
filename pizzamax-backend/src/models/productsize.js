'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProductSize extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ Product, Size }) {
            this.belongsTo(Product, { foreignKey: 'productId' });
            this.belongsTo(Size, { foreignKey: 'sectionId' });
        }
    }
    ProductSize.init(
        {
            section: {
                type: DataTypes.STRING,

                primaryKey: true,
            },
        },
        {
            sequelize,
            modelName: 'ProductSize',
        },
    );
    return ProductSize;
};
