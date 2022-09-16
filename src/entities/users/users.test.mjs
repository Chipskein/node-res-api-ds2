import {describe,expect,test} from 'vitest'
import request  from 'supertest'

import { CreateAppInstace } from '../../app.mjs'
//import { InitDatabaseTest,RemoveDatabaseTest } from '../../config/sequelize'

const app=CreateAppInstace();

describe("Testing Users Routes",async ()=>{
    describe("POST users/",()=>{
        
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



