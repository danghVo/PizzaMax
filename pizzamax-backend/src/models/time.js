'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Time extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here

            this.hasMany(models.Type, {
                foreignKey: 'timeId',
            });
        }
    }
    Time.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            fromDay: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            toDay: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            fromTime: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            toTime: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Time',
        },
    );
    return Time;
};
