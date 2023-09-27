'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Crust extends Model {
        static name = 'Crust';
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ Product, ProductCrust }) {
            // define association here

            this.belongsToMany(Product, { through: ProductCrust, foreignKey: 'sectionId' });
        }

        toJSON() {
            const crust = this.get();

            return {
                ...crust,
                ProductCrust: undefined,
                id: undefined,
                Section: crust.ProductCrust.section,
                price: parseInt(crust.price.split('.').join('')),
            };
        }
    }
    Crust.init(
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
            modelName: 'Crust',
        },
    );
    return Crust;
};
