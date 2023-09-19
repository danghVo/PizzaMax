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
                    name: 'detailId',
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
            selectionName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            selectionType: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            selectionPrice: {
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
