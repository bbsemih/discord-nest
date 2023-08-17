'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id: {
                type: Sequelize.UUID
            },
            guildId: {
                type: Sequelize.BIGINT
            },
            username: {
                type: Sequelize.STRING
            },
            fullName: {
                type: Sequelize.STRING
            },
            dateOfBirth: {
                type: Sequelize.DATE
            },
            email: {
                type: Sequelize.STRING
            },
            password: {
                type: Sequelize.STRING
            },
            role: {
                type: Sequelize.STRING
            },
            status: {
                type: Sequelize.STRING
            },
            isBot: {
                type: Sequelize.BOOLEAN
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
        await queryInterface.dropTable('Users');
    }
};