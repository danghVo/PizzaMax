'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Size extends Model {
        static name = 'Size';
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ Product, ProductSize }) {
            // define association here

            this.belongsToMany(Product, { through: ProductSize, foreignKey: 'sectionId' });
        }

        toJSON() {
            const size = this.get();

            return {
                ...size,
                ProductSize: undefined,
                id: undefined,
                Section: size.ProductSize.section,
                price: parseInt(size.price.split('.').join('')),
            };
        }
    }
    Size.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            price: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: '0',
            },
            signature: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Size',
        },
    );
    return Size;
};
