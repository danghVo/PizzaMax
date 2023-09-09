'use strict';
const { Model, UUIDV4 } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }

        toJSON() {
            return {
                ...this.get(),
                id: undefined,
            };
        }
    }
    User.init(
        {
            uuid: {
                type: DataTypes.UUID,
                allowNull: false,
                defaultValue: DataTypes.UUIDV4,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                get() {
                    const name = this.getDataValue('name');

                    return name || null;
                },
            },
            phoneNumber: {
                type: DataTypes.STRING,
                allowNull: false,

                get() {
                    const phoneNumber = this.getDataValue('phone_number');

                    return phoneNumber || null;
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,

                get() {
                    const password = this.getDataValue('password');

                    return password || null;
                },
            },
            token: {
                type: DataTypes.STRING,

                set(value) {
                    this.setDataValue('token', value);
                },
            },
        },
        {
            sequelize,
            tableName: 'users',
            modelName: 'User',
        },
    );
    return User;
};
