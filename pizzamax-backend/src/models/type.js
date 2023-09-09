'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Type extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ Time, Product }) {
            // define association here

            this.belongsTo(Time, {
                foreignKey: 'timeId',
            });

            this.hasMany(Product, {
                foreignKey: 'typeId',
            });
        }

        // toJSON() {
        //     return { ...this.get }
        // }
    }
    Type.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Type',
        },
    );
    return Type;
};
