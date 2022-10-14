var {Model, DataTypes} = require('sequelize');
class Account extends Model {
    otherInfo;  //additional non-database mirrored attribute
    static createModel(sequelize){
        Account.init({
            // Model attributes are defined here
            firstName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            dob: {
                type: DataTypes.DATE,
                //allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            securityQuestion: {
                type: DataTypes.STRING,
                //allowNull: false
            },
            securityQuestionAnswer: {
                type: DataTypes.STRING,
                //allowNull: false
            }
        }, {
            // Other model options go here
            sequelize, // We need to pass the connection instance
            modelName: 'User' // We need to choose the model name
        });
    }
}

module.exports = {
    Account: Account
}