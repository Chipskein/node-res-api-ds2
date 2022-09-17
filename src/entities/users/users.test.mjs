import {beforeAll, describe,expect,test} from 'vitest'
import request  from 'supertest'
import {unlink} from 'fs/promises'
import { CreateAppInstace } from '../../app.mjs'
import { CreateSequelizeInstance } from '../../config/sequelize.mjs';
import { HTTP_STATUS } from '../../config/http-status.mjs';
const database=CreateSequelizeInstance("test")
beforeAll(async ()=>{
    await database.sync()
})
const app=CreateAppInstace(database);

describe("Testing Routes",()=>{
    const CreateUsersTestTable=[
        ["brunao","eaiman","fklajsfkasjfkas",HTTP_STATUS.BAD_REQUEST],
        [null,null,null,HTTP_STATUS.BAD_REQUEST],
        ["fasfa",null,null,HTTP_STATUS.BAD_REQUEST],
        ["fkaksjfkasf","abfn0905@gmail.com","123456",HTTP_STATUS.OK],
        ["usuario ja existe","abfn0905@gmail.com","1234565125",HTTP_STATUS.CONFLICT],
    ]
    describe.each(CreateUsersTestTable)("Testing Register User name:%s email:%s password:%s",(name,email,password,expectedStatusCode)=>{
        test("POST /users/",async ()=>{
            const res=await request(app).post('/users/').send({
                name,
                email,
                password,
            })
            expect(res.statusCode).toBe(expectedStatusCode)
        })
    })
})

    
    



afterAll(async ()=>{
    const database_path=database.options.storage
    await unlink(database_path)
})



