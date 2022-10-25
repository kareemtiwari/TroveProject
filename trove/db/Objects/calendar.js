var {Model, DataTypes} = require('sequelize');
class Calendar extends Model {
    otherInfo;  //example additional non-database mirrored attribute
    //variables defined in create model are automatically defined and available
    //do not shadow them here

    /**
     * createModel - called once to create an instance / table in the sequelize db
     * @param sequelize - the sequelize instance
     */
    static createModel(sequelize){
        Calendar.init({
            // Model attributes are defined here
            CalendarID: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            UserID: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            EventsList: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            // Other model options go here
            sequelize, // We need to pass the connection instance
            modelName: 'Calendar' // We need to choose the model name
        });
    }
}

module.exports = {
    Calendar: Calendar
}