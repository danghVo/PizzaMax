'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AddressStore extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ Address }) {
            this.belongsTo(Address, { foreignKey: 'addressId' });
        }

        toJSON() {
            const addressStore = this.get();

            return {
                ...addressStore,
                Address: undefined,
                AddressId: undefined,
                address: addressStore.Address || undefined,
            };
        }
    }
    AddressStore.init(
        {
            addressId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
        },
        {
            timestamps: false,
            sequelize,
            modelName: 'AddressStore',
        },
    );
    return AddressStore;
};
