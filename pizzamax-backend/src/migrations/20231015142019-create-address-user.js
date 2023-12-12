'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('AddressUsers', {
            userId: {
                primaryKey: true,
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            addressId: {
                primaryKey: true,
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('AddressUsers');
    },
};
