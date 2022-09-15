
import { config } from 'dotenv';
config();
import { Sequelize } from 'sequelize';
export function CreateSequelizeInstance(env="prod"){
    if(env!="prod"){
        return new Sequelize({
            dialect: 'sqlite',
            storage: '../database/test-database.db'
        })    
    }
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


