
import { DataTypes, Model } from 'sequelize';
export default class Albums extends Model {
    static init(sequelize) {
        const tableConfig={ 
            sequelize, 
            schema: 'public',
            modelName: 'albums'
        }
        const tableDefinition={
            name:{
                type:DataTypes.STRING,
                allowNull:false
            },
            release_date:{
                type:DataTypes.DATE,
                allowNull:false
            },
            author:{
                type:DataTypes.ARRAY(DataTypes.STRING),
                allowNull:false
            },
        }
        super.init(tableDefinition,tableConfig)
    }
    static associate(models) {
    }
}