'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Times', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            fromDay: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            toDay: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            fromTime: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            toTime: {
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
        await queryInterface.dropTable('Times');
    },
};
