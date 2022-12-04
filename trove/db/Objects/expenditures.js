const {Model, DataTypes} = require('sequelize');

class Expenditures extends Model {
    otherInfo;  //example additional non-database mirrored attribute
    //variables defined in create model are automatically defined and available
    //do not shadow them here

    /**
     * createModel - called once to create an instance / table in the sequelize db
     * @param sequelize - the sequelize instance
     */
    static createModel(sequelize) {
        Expenditures.init({
            // Model attributes are defined here
            value: {
                type: DataTypes.DECIMAL,
                allowNull: false
            },
            userID: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                //allowNull: false
            },
            category: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            // Other model options go here
            sequelize, // We need to pass the connection instance
            modelName: 'Expenditures' // We need to choose the model name
        });
    }
}

module.exports = {
    Expenditures: Expenditures
}