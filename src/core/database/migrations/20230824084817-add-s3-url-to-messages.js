'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.addColumn('messages', 's3_url', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.removeColumn('messages', 's3_url');
    }
};