var {Model, DataTypes} = require('sequelize');
class Account extends Model {
    otherInfo;  //additional non-database mirrored attribute
    static createModel(sequelize){
        Account.init({id:{
                    type: DataTypes
                }
            },{sequelize});
    }
}