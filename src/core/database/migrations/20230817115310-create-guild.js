'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('guilds', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            description: {
                type: Sequelize.STRING
            },
            ownerId: {
                type: Sequelize.UUID
            },
            memberCount: {
                type: Sequelize.INTEGER
            },
            icon: {
                type: Sequelize.STRING
            },
            roles: {
                type: Sequelize.ARRAY(Sequelize.STRING),
                allowNull: false,
            },
            region: {
                type: Sequelize.STRING
            },
            nsfwLevel: {
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Guilds');
    }
};