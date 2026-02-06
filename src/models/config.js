const { DataTypes } = require('sequelize');
const { configdb } = require('../databases.js');

const config = configdb.define(
    'Config',
    {
        server: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        features: {
            type: DataTypes.JSON,
            defaultValue: {}
        },
        emojis: {
            type: DataTypes.JSON,
            defaultValue: {}
        },
        edit_timeout: {
            type: DataTypes.FLOAT,
            defaultValue: 10.0
        }
    }
);

const feature_channels = configdb.define(
    'Feature_Channels',
    {
        channels: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: []
        },
        allow: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        feature: {
            type: DataTypes.STRING,
            defaultValue: 'nottako'
        }
    }
);

config.hasOne(feature_channels, { foreignKey: 'ConfigServer' });
feature_channels.belongsTo(config, { foreignKey: 'ConfigServer' });

module.exports = {
    Config: config,
    Feature_Channels: feature_channels,
    configdb
};
