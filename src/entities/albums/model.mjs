
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
            authors:{
                type:DataTypes.STRING,
                allowNull:false
            },
        }
        super.init(tableDefinition,tableConfig)
    }
    static associate(models) {
        this.belongsTo(models.users)
        this.hasMany(models.musics,{onDelete:"cascade"})
    }
}