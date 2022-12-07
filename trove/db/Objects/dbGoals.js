var {Model, DataTypes} = require('sequelize');
class DbGoals extends Model {
    otherInfo;  //additional non-database mirrored attribute
    static createModel(sequelize){
        DbGoals.init({
            // Model attributes are defined here
            userID: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            goalID: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            goalAmount: {
                type: DataTypes.FLOAT,
                allowNull: true
            },
            goalProgress: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            goalName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            goalSlider: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            goalLimit: {
                type: DataTypes.FLOAT,
                allowNull: false
            }


        }, {
            // Other model options go here
            sequelize, // We need to pass the connection instance
            modelName: 'DbGoals' // We need to choose the model name
        });
    }
}

module.exports = {
    DbGoals: DbGoals
}