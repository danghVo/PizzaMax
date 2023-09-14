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
            this.hasMany(Selection);
        }
    }
    Detail.init(
        {
            uuid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
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
