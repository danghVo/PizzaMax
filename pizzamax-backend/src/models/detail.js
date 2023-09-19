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
            this.belongsTo(Cart, {
                foreignKey: {
                    name: 'cartId',
                    type: DataTypes.UUID,
                },
            });

            this.hasMany(Selection, {
                foreignKey: {
                    name: 'detailId',
                    type: DataTypes.UUID,
                },
            });
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
        },
        {
            sequelize,
            modelName: 'Detail',
        },
    );
    return Detail;
};
