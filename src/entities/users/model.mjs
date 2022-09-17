import { DataTypes, Model } from 'sequelize';
export default class Users extends Model {
    static init(sequelize) {
        const tableConfig={ 
            sequelize, 
            schema: 'public',
            modelName: 'users'
        }
        const tableDefinition={
            email:{
                type:DataTypes.STRING,
                unique:true,
                allowNull: false
            },
            name:{
                type:DataTypes.STRING,
                allowNull: false
            },
            password:{
                type:DataTypes.STRING,
                allowNull: false
            },
        }
        super.init(tableDefinition,tableConfig)
    }
    
    static associate(models) {
        this.hasMany(models.albums,{onDelete:"cascade"})       
    }
}