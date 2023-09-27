'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            'Cities',
            [
                {
                    id: 1,
                    name: 'Can Tho',
                },
                {
                    id: 2,
                    name: 'Ho Chi Minh',
                },
            ],
            {},
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Cities', null, {});
    },
};
