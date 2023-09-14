'use strict';
const { Model, UUIDV4 } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ Cart, City, Address }) {
            this.belongsToMany(City, { through: Address, foreignKey: 'userId' });
            this.hasMany(Cart);
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
            },
            phoneNumber: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            token: {
                type: DataTypes.STRING,
            },
            role: {
                type: DataTypes.STRING,
                defaultValue: 'user',
                allowNull: false,
            },
            avatar: {
                type: DataTypes.STRING,
                defaultValue: 'noImage',
                allowNull: false,
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
