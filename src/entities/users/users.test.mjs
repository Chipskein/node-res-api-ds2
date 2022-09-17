import {beforeAll, describe,expect,test} from 'vitest'
import request  from 'supertest'
import {unlink} from 'fs/promises'
import { CreateAppInstace } from '../../app.mjs'
import { CreateSequelizeInstance } from '../../config/sequelize.mjs';
import { HTTP_STATUS } from '../../config/http-status.mjs';
import { verifyJWT } from '../../utils/token.mjs';
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
    const LoginUsersTestTable=[
        [null,"uma senha errada",HTTP_STATUS.UNAUTHORIZED],
        [null,null,HTTP_STATUS.UNAUTHORIZED],
        ["abfn0905@gmail.com","uma senha errada",HTTP_STATUS.UNAUTHORIZED],
        ["abfn0905@gmail.com","123456",HTTP_STATUS.OK],
        ["user@naoexiste.com.org","123456",HTTP_STATUS.UNAUTHORIZED],
    ]

    describe.each(LoginUsersTestTable)("Testing Login User email:%s password:%s",(email,password,expectedStatusCode)=>{
        test("POST /users/login",async ()=>{
            const res=await request(app).post('/users/login').send({
                email,
                password,
            })
            expect(res.statusCode).toBe(expectedStatusCode)
            if(res.statusCode==HTTP_STATUS.OK){
                const {body:{token}} = res
                expect(token).toBeTypeOf("string");
                expect(verifyJWT(token)).toBeDefined();
            }
        })
    })

    test("GET /users/",async ()=>{
        const res=await request(app).get('/users/').send()
        expect(res.statusCode).toBe(HTTP_STATUS.OK)
        expect(res.body.count).toBeGreaterThanOrEqual(0);
        expect(res.body.users.length).toBeGreaterThanOrEqual(0);
    })
    

    const GetUsersTestTable=[
        [12412,HTTP_STATUS.NOT_FOUND],
        [99123,HTTP_STATUS.NOT_FOUND],
        [9999,HTTP_STATUS.NOT_FOUND],
        [9999,HTTP_STATUS.NOT_FOUND],
        [915121,HTTP_STATUS.NOT_FOUND],
        [1,HTTP_STATUS.OK],
        [1.999999,HTTP_STATUS.BAD_REQUEST],
        [1.00000,HTTP_STATUS.OK],
        [1.12,HTTP_STATUS.BAD_REQUEST],
    ]
    describe.each(GetUsersTestTable)("Testing Get User Id:%d",(id,expectedStatusCode)=>{
        test("GET /users/:id",async ()=>{
            const res=await request(app).get(`/users/${id}`)
            expect(res.statusCode).toBe(expectedStatusCode)
            if(res.statusCode==HTTP_STATUS.OK){
                expect(res.body.password).toBeUndefined()
                expect(res.body.id).toBeDefined()
                expect(res.body.name).toBeDefined()
                expect(res.body.email).toBeDefined()
                expect(res.body.createdAt).toBeDefined()
                expect(res.body.updatedAt).toBeDefined()
            }
        })
    })





})

    
    



afterAll(async ()=>{
    const database_path=database.options.storage
    await unlink(database_path)
})



