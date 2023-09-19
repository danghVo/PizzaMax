'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Selections', {
            uuid: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
            detailId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'Details',
                    key: 'uuid',
                    as: 'detailId',
                },
            },
            selectionName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            selectionPrice: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            selectionType: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            section: {
                type: Sequelize.STRING,
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
        await queryInterface.dropTable('Selections');
    },
};
