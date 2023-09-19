'use strict';
const { Model, UUIDV4 } = require('sequelize');

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

            const size = product.Sizes || [];
            const crust = product.Crusts || [];
            const flavor = product.Flavors || [];
            const drink = product.Drinks || [];

            let sections = [
                ...size.map((item) => item.getDataValue('ProductSize').section),
                ...crust.map((item) => item.getDataValue('ProductCrust').section),
                ...flavor.map((item) => item.getDataValue('ProductFlavor').section),
                ...drink.map((item) => item.getDataValue('ProductDrink').section),
            ].reduce((accu, curr) => (accu.includes(curr) ? [...accu] : [...accu, curr]), []);

            const discOptions =
                sections.length > 0
                    ? sections.map((section) => {
                          return {
                              name: section,
                              subOptions: [
                                  ...size.filter((item) => item.getDataValue('ProductSize').section === section),
                                  ...flavor.filter((item) => item.getDataValue('ProductFlavor').section === section),
                                  ...crust.filter((item) => item.getDataValue('ProductCrust').section === section),
                                  ...drink.filter((item) => item.getDataValue('ProductDrink').section === section),
                              ],
                          };
                      })
                    : undefined;

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
