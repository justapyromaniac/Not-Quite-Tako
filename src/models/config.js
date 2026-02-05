const { DataTypes } = require('sequelize');
const { configdb } = require('../databases.js');

const config = configdb.define(
    'Config',
    {
        server: {
            type: DataTypes.BIGINT,
            primaryKey: true
        }
    }
)

const react_channels = configdb.define(
    'React_Channels',
    {
        channels: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: []
        },
        allow: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }
)

config.hasOne(react_channels)
react_channels.belongsTo(config)

module.exports = {
    configdb
}