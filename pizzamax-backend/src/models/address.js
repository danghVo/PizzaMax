'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Address extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ City, Cart, User }) {
            this.belongsTo(City, { foreignKey: 'cityId' });
            this.hasMany(Cart);
            this.belongsTo(User, { foreignKey: 'userId' });
        }

        toJSON() {
            const address = this.get();

            return {
                ...address,
                userId: undefined,
                UserId: undefined,
                cityId: undefined,
                CityId: undefined,
                City: undefined,
                city: address.City?.name,
            };
        }
    }
    Address.init(
        {
            type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            district: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            street: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            alley: {
                type: DataTypes.INTEGER,
            },
            houseNumber: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Address',
        },
    );
    return Address;
};
