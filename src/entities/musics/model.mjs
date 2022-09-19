
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
                type:DataTypes.BIGINT,
                allowNull:false
            },
            name:{
                type:DataTypes.STRING,
                allowNull:false
            },
            formats:{
                type:DataTypes.STRING,
                allowNull:false
            },
            authors:{
                type:DataTypes.STRING,
                allowNull:true
            },
        }
        super.init(tableDefinition,tableConfig)
    }
    
    static associate(models) {
        this.belongsTo(models.albums)
    }
}