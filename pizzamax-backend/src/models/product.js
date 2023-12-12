'use strict';
const { Model, UUIDV4 } = require('sequelize');
const uniqueValue = require('../utils/uniqueValue');
const moment = require('moment');

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
            Cart,
            Detail,
            User,
            ProductCrust,
            ProductSize,
            ProductFlavor,
            ProductDrink,
            Favorite,
        }) {
            this.belongsTo(Type);

            this.belongsTo(Discount);

            this.belongsToMany(Crust, { through: ProductCrust, foreignKey: 'productId' });
            this.belongsToMany(Size, { through: ProductSize, foreignKey: 'productId' });
            this.belongsToMany(Flavor, { through: ProductFlavor, foreignKey: 'productId' });
            this.belongsToMany(Drink, { through: ProductDrink, foreignKey: 'productId' });
            this.belongsToMany(Cart, { through: Detail, foreignKey: 'productId' });
            this.belongsToMany(User, { through: Favorite, foreignKey: 'productId' });
        }

        toJSON() {
            const product = this.get();

            const size = product.Sizes || [];
            const crust = product.Crusts || [];
            const flavor = product.Flavors || [];
            const drink = product.Drinks || [];

            const sizeSections = uniqueValue(size.map((item) => item.getDataValue('ProductSize').section));
            const crustSections = uniqueValue(crust.map((item) => item.getDataValue('ProductCrust').section));
            const flavorSections = uniqueValue(flavor.map((item) => item.getDataValue('ProductFlavor').section));
            const drinkSections = uniqueValue(drink.map((item) => item.getDataValue('ProductDrink').section));

            let sections = [
                ...sizeSections.map((item) => ({ name: item, type: 'size' })),
                ...crustSections.map((item) => ({ name: item, type: 'crust' })),
                ...flavorSections.map((item) => ({ name: item, type: 'flavor' })),
                ...drinkSections.map((item) => ({ name: item, type: 'drink' })),
            ];
            const discOptions =
                sections.length > 0
                    ? sections.map((section) => {
                          return {
                              ...section,
                              subOptions: [
                                  ...size.filter((item) => item.getDataValue('ProductSize').section === section.name),
                                  ...flavor.filter(
                                      (item) => item.getDataValue('ProductFlavor').section === section.name,
                                  ),
                                  ...crust.filter((item) => item.getDataValue('ProductCrust').section === section.name),
                                  ...drink.filter((item) => item.getDataValue('ProductDrink').section === section.name),
                              ],
                          };
                      })
                    : [];

            return {
                ...product,
                DiscountId: undefined,
                TypeId: undefined,
                Sizes: undefined,
                Flavors: undefined,
                Crusts: undefined,
                Detail: undefined,
                Drinks: undefined,
                detail: product?.Detail,
                type: product?.Type.name || undefined,
                discOptions,
                price: parseInt(product.price.split('.').join('')),
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
            hide: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false,
            },
        },
        {
            sequelize,
            modelName: 'Product',
        },
    );

    return Product;
};
