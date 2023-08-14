'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.belongsTo(models.Guild, { foreignKey: 'guildId' });
            User.hasMany(models.Message, { foreignKey: 'userId' });
        }
    }

    User.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        guildId: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dateOfBirth: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'member',
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'joined',
        },
        isBot: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        underscored: true,
    });

    return User;
};