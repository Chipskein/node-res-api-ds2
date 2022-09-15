import { Sequelize } from 'sequelize';
import { config } from 'dotenv';
import path  from 'path'
config();

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
        storage: path.join(__dirname, '../database', 'test-database.sqlite.db'),
        username: 'root',
        password: 'root',
        host: 'localhost',
        dialect: 'sqlite',
        logging: console.log
    })    
    
}
export function InitSequelizeModels(db){
    const { models } = db;
    const modelNames=Object.keys(models)
    modelNames.map(modelName=>{
        const model=models[modelName]
        model.init(db)
    })
}

export function RunAssociationFromDBModels(db){
    const { models } = db;
    const modelNames=Object.keys(models)
    modelNames.map(modelName=>{
        const model=models[modelName]
        model.associate(models)
    })
}