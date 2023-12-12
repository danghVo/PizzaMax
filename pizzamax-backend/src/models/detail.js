'use strict';
const { Model, UUIDV4 } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Detail extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ Cart, Product, Selection }) {
            this.belongsTo(Product, { foreignKey: 'productId' });
            this.belongsTo(Cart);

            this.hasMany(Selection);
        }

        toJSON() {
            const detail = this.get();

            return {
                ...detail,
                productId: undefined,
                price: parseInt(detail.price),
                quantity: parseInt(detail.quantity),
            };
        }
    }
    Detail.init(
        {
            uuid: {
                type: DataTypes.UUID,
                allowNull: false,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,

                get() {
                    return this.getDataValue('uuid');
                },
            },
            quantity: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
                allowNull: false,
            },
            price: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            saleOff: {
                type: DataTypes.INTEGER,
            },
        },
        {
            sequelize,
            modelName: 'Detail',
        },
    );
    return Detail;
};
