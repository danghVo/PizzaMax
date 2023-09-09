'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Flavor extends Model {
        static name = 'Flavor';
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ Product, ProductFlavor }) {
            this.belongsToMany(Product, { through: ProductFlavor, foreignKey: 'sectionId' });
        }

        toJSON() {
            const flavor = this.get();

            return {
                ...flavor,
                ProductFlavor: undefined,
                id: undefined,
                Section: flavor.ProductFlavor.section,
            };
        }
    }
    Flavor.init(
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
            modelName: 'Flavor',
        },
    );
    return Flavor;
};
