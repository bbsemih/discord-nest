'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Guild extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Guild.init({
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        ownerId: DataTypes.UUID,
        memberCount: DataTypes.INTEGER,
        icon: DataTypes.STRING,
        roles: DataTypes.ARRAY(DataTypes.STRING),
        region: DataTypes.STRING,
        nsfwLevel: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Guild',
    });
    return Guild;
};