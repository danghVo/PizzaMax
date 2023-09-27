'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ User, Detail, Product, Status, Orderway, Address }) {
            this.belongsTo(User, { foreignKey: 'userId' });
            this.belongsToMany(Product, {
                through: Detail,
                foreignKey: {
                    name: 'cartUUID',
                    type: DataTypes.UUID,
                },
            });
            this.belongsTo(Status, { foreignKey: { name: 'statusId' } });
            this.belongsTo(Orderway, { foreignKey: { name: 'orderwayId', allowNull: true } });
            this.belongsTo(Address, { foreignKey: { name: 'addressId' } });
        }

        toJSON() {
            const cart = this.get();
            return {
                ...cart,
                userId: undefined,
                UserId: undefined,
                statusId: undefined,
                StatusId: undefined,
                Status: undefined,
                OrderwayId: undefined,
                orderwayId: undefined,
                addressId: undefined,
                AddressId: undefined,
                addressId: undefined,
                AddressId: undefined,
                Orderway: cart.Orderways?.name || undefined,
                status: cart.Status.name,
            };
        }
    }
    Cart.init(
        {
            uuid: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            deliveryCharges: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: '15.000',
            },
            subTotal: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: '0',
            },
            total: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: '0',
            },
            checkOutAt: {
                type: DataTypes.DATE,
            },
        },
        {
            sequelize,
            modelName: 'Cart',
        },
    );

    return Cart;
};
