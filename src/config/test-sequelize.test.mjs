import {describe, expect, it} from 'vitest';
import { CreateSequelizeInstance, InitSequelizeModels, RunAssociationFromDBModels } from './sequelize'

describe("Testando Sequelize",()=>{
    test('should first', () => { 
        const db=CreateSequelizeInstance("test")
        InitSequelizeModels(db)
     })
     test('should first', () => { 
        const db=CreateSequelizeInstance("test")
       RunAssociationFromDBModels(db)
     })
})