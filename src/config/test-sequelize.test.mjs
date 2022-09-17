import {afterAll, describe, expect} from 'vitest';
import Users from '../entities/users/model.mjs';
import { CreateSequelizeInstance,RunAssociationFromDBModels,InitSequelizeModels } from './sequelize'
import { unlink } from 'fs/promises'

const db=CreateSequelizeInstance("test")
describe("Testando Setup",()=>{
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
describe("Testando Models",()=>{
    test("Criando User",async ()=>{
        await Users.create({
            name:"Jonh Doe",
            email:"Joazim@mail.com",
            password:"no-bycript"
        })
    })

    test("Get User Info",async ()=>{
        const user=await Users.findAll({where:{name:"Jonh Doe"}})
        expect(user.length).toBeGreaterThan(0);
    })
})

afterAll(async ()=>{
    const database_path=db.options.storage
    await unlink(database_path)
})