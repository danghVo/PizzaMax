'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Address extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ AddressUser, AddressStore, City, Cart }) {
            this.belongsTo(City, { foreignKey: 'cityId' });
            this.hasMany(Cart);
            this.hasOne(AddressStore);
            this.hasOne(AddressUser);
        }

        toJSON() {
            const address = this.get();

            return {
                ...address,
                CityId: undefined,
                cityId: undefined,
                city: address.City?.name,
            };
        }
    }
    Address.init(
        {
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
            ward: {
                type: DataTypes.STRING,
            },
            houseNumber: {
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
