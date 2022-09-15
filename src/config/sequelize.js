import { Sequelize } from 'sequelize';
import { config } from 'dotenv';
config();
import  Albums from '../entities/albums/model.mjs'
import  Musics from '../entities/musics/model.mjs'
import  Users  from '../entities/users/model.mjs'



export function CreateSequelizeInstance(env="prod"){
    if(env=="prod"){
        const DATABASE_URL=process.env.DATABASE_URL;
        const DATABASE_CONFIG={
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            },
        }
        return  new Sequelize(DATABASE_URL,DATABASE_CONFIG) 
    }
    return new Sequelize({
        dialect: 'sqlite',
        storage: '../database/test-database.db'
    })    
    
}
export function InitSequelizeModels(db){
    Albums.init(db)
    Musics.init(db)
    Users.init(db)
}

export function RunAssociationFromDBModels(db){
    const { models } = db;
    const modelNames=Object.keys(models)
    modelNames.map(modelName=>{
        const model=models[modelName]
        model.associate(models)
    })
}