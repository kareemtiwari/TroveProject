const {Model, DataTypes} = require('sequelize');

class Jobs extends Model {
    static createModel(sequelize) {
        Jobs.init({
            // Model attributes are defined here
            jobID: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            userID: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            jobName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            jobType: {
                type: DataTypes.BOOLEAN,    // True if salary, False if hourly
                allowNull: false
            },
            jobPay: {
                type: DataTypes.FLOAT,      // Should be the hourly pay rate of the job
                allowNull: false
            },
        }, {
            // Other model options go here
            sequelize, // We need to pass the connection instance
            modelName: 'Jobs' // We need to choose the model name
        });
    }
}

module.exports = {
    Jobs: Jobs
}