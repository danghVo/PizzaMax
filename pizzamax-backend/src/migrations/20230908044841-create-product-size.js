'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ProductSizes', {
            section: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING,
            },
            productId: {
                allowNull: false,
                primaryKey: true,

                type: Sequelize.INTEGER,
                references: {
                    model: 'Products',
                    key: 'id',
                    as: 'productId',
                },
            },
            sectionId: {
                allowNull: false,
                primaryKey: true,

                type: Sequelize.INTEGER,
                references: {
                    model: 'Sizes',
                    key: 'id',
                    as: 'sectionId',
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
        await queryInterface.dropTable('ProductSizes');
    },
};
