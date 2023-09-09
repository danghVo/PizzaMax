'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Discounts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            saleoff: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            timeId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Times',
                    key: 'id',
                    as: 'timeId',
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
        await queryInterface.dropTable('Discounts');
    },
};
