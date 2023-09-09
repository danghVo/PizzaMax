'use strict';
const { Model, UUIDV4 } = require('sequelize');
const type = require('./type');
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({
            Type,
            Discount,
            Crust,
            Flavor,
            Size,
            Drink,
            ProductCrust,
            ProductSize,
            ProductFlavor,
            ProductDrink,
        }) {
            this.belongsTo(Type);

            this.belongsTo(Discount);

            this.belongsToMany(Crust, { through: ProductCrust, foreignKey: 'productId' });
            this.belongsToMany(Size, { through: ProductSize, foreignKey: 'productId' });
            this.belongsToMany(Flavor, { through: ProductFlavor, foreignKey: 'productId' });
            this.belongsToMany(Drink, { through: ProductDrink, foreignKey: 'productId' });
        }

        toJSON() {
            const product = this.get();

            return {
                ...product,
                id: undefined,
                DiscountId: undefined,
                TypeId: undefined,
                typeId: undefined,
                Type: product.Type.name,
            };
        }
    }
    Product.init(
        {
            uuid: {
                type: DataTypes.UUID,
                defaultValue: UUIDV4,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            price: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            image: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            signature: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'Product',
        },
    );

    return Product;
};
