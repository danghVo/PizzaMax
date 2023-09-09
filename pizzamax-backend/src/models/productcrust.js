'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProductCrust extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ Product, Crust }) {
            this.belongsTo(Product, { foreignKey: 'productId' });
            this.belongsTo(Crust, { foreignKey: 'sectionId' });
        }
    }
    ProductCrust.init(
        {
            section: {
                type: DataTypes.STRING,

                primaryKey: true,
            },
        },
        {
            sequelize,
            modelName: 'ProductCrust',
        },
    );
    return ProductCrust;
};
