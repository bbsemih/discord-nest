'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            guildId: {
                type: Sequelize.BIGINT,
                allowNull: true,
                references: {
                    model: 'Guilds',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            username: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            fullName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            dateOfBirth: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            role: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'member',
            },
            status: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'joined',
            },
            isBot: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
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
        await queryInterface.addIndex('Users', ['guildId']);
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable('Users');
    },
};