import {beforeAll, describe,expect,test} from 'vitest'
import request  from 'supertest'
import {unlink} from 'fs/promises'
import { CreateAppInstace } from '../../app.mjs'
import { CreateSequelizeInstance } from '../../config/sequelize.mjs';

const database=CreateSequelizeInstance("test")
beforeAll(async ()=>{
    await database.sync()
})
const app=CreateAppInstace(database);
describe("Testing Users Routes",async ()=>{    
    describe("POST /users/",()=>{
        
        test("should Create User",async()=>{
            const res=await request(app).post('/users/').send({
                name:"eaiman",
                email:"jafklajsfkljasklf",
                password:"fçalklfç~kalsfk",
            })
            expect(res.statusCode).toBe(200)
    
        })
        
    });

})
afterAll(async ()=>{
    const database_path=database.options.storage
    await unlink(database_path)
})



