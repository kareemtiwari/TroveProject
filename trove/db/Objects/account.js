var {Model, DataTypes} = require('sequelize');
class Account extends Model {
    otherInfo;  //example additional non-database mirrored attribute
    //variables defined in create model are automatically defined and available
    //do not shadow them here

    /**
     * createModel - called once to create an instance / table in the sequelize db
     * @param sequelize - the sequelize instance
     */
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
            },
            salary: {       //TODO - were required but not in model
                type: DataTypes.NUMBER
            },
            payMode: {
                type: DataTypes.BOOLEAN
            },
            accComplete: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            },
            hourlyIncome: {
                type: DataTypes.FLOAT,
                defaultValue: 0.0
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