import {describe, expect, it} from 'vitest';
import { CreateSequelizeInstance, InitSequelizeModels, RunAssociationFromDBModels } from './sequelize'

describe("Testando Sequelize",()=>{
    const db=CreateSequelizeInstance("test")
    test("Testing Connection With Sqlite Database",()=>{
        db.authenticate()
            .then(data=>console.log("Passou"))
            .catch(error=> expect(error).toBe(null))
        ;
    })
    test('should first', () => { 
        InitSequelizeModels(db)
     })
     test('should first', () => { 
       RunAssociationFromDBModels(db)
     })
})