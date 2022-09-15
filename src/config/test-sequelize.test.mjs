import {describe, expect, it} from 'vitest';
import { CreateSequelizeInstance, InitSequelizeModels, RunAssociationFromDBModels } from './sequelize'

describe("Testando Sequelize",()=>{
    const db=CreateSequelizeInstance("test")
    test('Init Models', () => { 
        InitSequelizeModels(db)
     })
     test('Load Associations', () => { 
        RunAssociationFromDBModels(db)
     })
     test("Sync",async ()=>{
         await db.sync();
     })
     
     
})