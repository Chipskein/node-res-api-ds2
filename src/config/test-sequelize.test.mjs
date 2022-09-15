import {test} from 'vitest';
import { CreateSequelizeInstance } from './sequelize'

test("Testando Sequelize com Sqlite",async ()=>{
    const db=CreateSequelizeInstance("test")
    try {
        await db.authenticate();
        console.log('Connection has been established successfully.');
      } 
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})