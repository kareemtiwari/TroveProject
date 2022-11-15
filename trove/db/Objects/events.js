var {Model, DataTypes} = require('sequelize');
class Events extends Model {
    otherInfo;  //additional non-database mirrored attribute
    static createModel(sequelize){
        Events.init({
            // Model attributes are defined here
            eventID: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            userID: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            eventName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            eventDay: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            eventStartTime: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            eventEndTime: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            eventJob: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
        }, {
            // Other model options go here
            sequelize, // We need to pass the connection instance
            modelName: 'Events' // We need to choose the model name
        });
    }
}

module.exports = {
    Events: Events
}