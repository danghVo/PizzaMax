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
            Cart,
            Detail,
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
            this.belongsToMany(Cart, { through: Detail, foreignKey: 'productId' });
        }

        toJSON() {
            const product = this.get();

            const sections = [
                ...product.Sizes.map((item) => item.dataValues.ProductSize.dataValues.section),
                ...product.Crusts.map((item) => item.dataValues.ProductCrust.dataValues.section),
                ...product.Flavors.map((item) => item.dataValues.ProductFlavor.dataValues.section),
                ...product.Drinks.map((item) => item.dataValues.ProductDrink.dataValues.section),
            ].reduce((accu, curr) => (accu.includes(curr) ? [...accu] : [...accu, curr]), []);

            const discOptions = sections.map((section) => {
                return {
                    name: section,
                    subOptions: [
                        ...product.Sizes.filter((item) => item.dataValues.ProductSize.dataValues.section === section),
                        ...product.Flavors.filter(
                            (item) => item.dataValues.ProductFlavor.dataValues.section === section,
                        ),
                        ...product.Crusts.filter((item) => item.dataValues.ProductCrust.dataValues.section === section),
                        ...product.Drinks.filter((item) => item.dataValues.ProductDrink.dataValues.section === section),
                    ],
                };
            });

            return {
                ...product,
                id: undefined,
                DiscountId: undefined,
                TypeId: undefined,
                typeId: undefined,
                Type: undefined,
                Sizes: undefined,
                Flavors: undefined,
                Crusts: undefined,
                type: product.Type.name,
                discount: product.Discount || undefined,
                discOptions,
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
