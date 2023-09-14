'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Carts', {
            uuid: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'Users',
                    key: 'id',
                    as: 'userId',
                },
            },
            deliveryCharges: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            subTotal: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            total: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            checkOutAt: {
                type: Sequelize.DATE,
            },
            statusId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Statuses',
                    key: 'id',
                    as: 'statusId',
                },
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
        await queryInterface.dropTable('Carts');
    },
};
