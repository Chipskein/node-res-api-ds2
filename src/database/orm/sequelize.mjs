import { Sequelize } from 'sequelize';
import path  from 'path'
import { unlink } from 'fs/promises';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { config } from 'dotenv';
config();
import Users from '../../entities/users/model.mjs';
import Albums from '../../entities/albums/model.mjs';
import Musics from '../../entities/musics/model.mjs';

export function CreateSequelizeInstance(env){
    if(env=="prod"){
        const DATABASE_URL=process.env.DATABASE_URL;
        return  new Sequelize(DATABASE_URL);
    }
    if(env=="dev"){
        return new Sequelize({
            dialect: 'sqlite',
            storage: path.join(__dirname, '../', `dev-database.sqlite`),
            dialect: 'sqlite',
            logging:console.log
        })
    }
    return new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '../', `test-database${Math.floor(Math.random()*9999)}.sqlite`),
        dialect: 'sqlite',
        logging:false
    })    
        
    
}
export function InitSequelizeModels(db){
   Users.init(db)
   Albums.init(db)
   Musics.init(db)
}
export function RunAssociationFromDBModels(db){
    const { models } = db;
    const modelNames=Object.keys(models)
    modelNames.map(modelName=>{
        const model=models[modelName]
        model.associate(models)
    })
}


export async function InitDatabase(db){
    InitSequelizeModels(db)
    RunAssociationFromDBModels(db)
    if(process.env.ENVIROMENT!='prod'&&process.env.ENVIROMENT!='dev') return db;
    (async ()=>await db.sync())();
    return db;
}


export async function RemoveDatabaseTest(db){
    const database_path=db.options.storage
    await unlink(database_path)
}