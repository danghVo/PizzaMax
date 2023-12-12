'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Products', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            uuid: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            price: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            image: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            discountId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Discounts',
                    key: 'id',
                    as: 'discountId',
                },
            },
            description: {
                type: Sequelize.STRING,
            },
            typeId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Types',
                    key: 'id',
                    as: 'typeId',
                },
            },
            signature: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            hide: {
                type: Sequelize.BOOLEAN,
                defaultValue: 0,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Products');
    },
};
