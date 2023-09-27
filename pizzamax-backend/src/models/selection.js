'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Selection extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ Detail }) {
            this.belongsTo(Detail, {
                foreignKey: {
                    name: 'detailUUID',
                    type: DataTypes.UUID,
                },
            });
        }

        toJSON() {
            const selection = this.get();

            return {
                ...selection,
                detailId: undefined,
                uuid: undefined,
            };
        }
    }
    Selection.init(
        {
            uuid: {
                type: DataTypes.UUID,
                allowNull: false,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            price: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: '0',
            },
            section: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Selection',
        },
    );
    return Selection;
};
