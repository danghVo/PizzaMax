'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Details', {
            uuid: {
                type: Sequelize.UUID,
                primaryKey: true,
                allowNull: false,
            },
            productId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Products',
                    key: 'id',
                    as: 'productId',
                },
            },
            cartUUID: {
                type: Sequelize.UUID,
                allowNull: false,

                references: {
                    model: 'Carts',
                    key: 'uuid',
                    as: 'cartUUID',
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
