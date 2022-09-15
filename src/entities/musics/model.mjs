
import { DataTypes, Model } from 'sequelize';
export default class Musics extends Model {
    static init(sequelize) {
        const tableConfig={ 
            sequelize, 
            schema: 'public',
            modelName: 'musics'
        }
        const tableDefinition={
            duration:{
                //segundos
                type:DataTypes.BIGINT,
                allowNull:false
            },
            name:{
                type:DataTypes.STRING,
                allowNull:false
            },
            formatos:{
                type:DataTypes.ARRAY(DataTypes.STRING),
                allowNull:false
            },
        }
        super.init(tableDefinition,tableConfig)
    }
    
    static associate(models) {
    }
}