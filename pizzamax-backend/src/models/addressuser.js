'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AddressUser extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ Address, User }) {
            this.belongsTo(User, { foreignKey: 'userId' });
            this.belongsTo(Address, { foreignKey: 'addressId' });
        }

        toJSON() {
            const addressUser = this.get();

            return {
                ...addressUser,
                userId: undefined,
                UserId: undefined,
                Address: undefined,
                AddressId: undefined,
                address: addressUser.Address || undefined,
            };
        }
    }
    AddressUser.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            addressId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
        },
        {
            sequelize,
            timestamps: false,
            modelName: 'AddressUser',
        },
    );
    return AddressUser;
};
