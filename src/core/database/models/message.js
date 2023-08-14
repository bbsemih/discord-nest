'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Message extends Model {

        static associate(models) {
            // asscociations can be defined here
        }
    }
    Message.init({
        userId: DataTypes.UUID,
        content: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        guildID: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Message',
    });
    return Message;
};