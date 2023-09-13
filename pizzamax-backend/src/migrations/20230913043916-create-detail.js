'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Details', {
            productId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'Products',
                    key: 'id',
                    as: 'productId',
                },
            },
            cartId: {
                type: Sequelize.UUID,
                primaryKey: true,
                references: {
                    model: 'Carts',
                    key: 'uuid',
                    as: 'cartId',
                },
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
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
        await queryInterface.dropTable('Details');
    },
};
