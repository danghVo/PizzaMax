'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Addresses', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            cityId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'cities',
                    key: 'id',
                    as: 'cityId',
                },
            },
            street: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            district: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            alley: {
                type: Sequelize.INTEGER,
            },
            ward: {
                type: Sequelize.STRING,
            },
            houseNumber: {
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
        await queryInterface.dropTable('Addresses');
    },
};
