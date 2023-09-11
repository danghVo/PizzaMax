'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Drink extends Model {
        static name = 'Drink';
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ Product, ProductDrink }) {
            this.belongsToMany(Product, { through: ProductDrink, foreignKey: 'sectionId' });
        }

        toJSON() {
            const drink = this.get();

            return {
                ...drink,
                ProductDrink: undefined,
                id: undefined,
                Section: drink.ProductDrink.section,
            };
        }
    }
    Drink.init(
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
            modelName: 'Drink',
        },
    );
    return Drink;
};
