import {beforeAll, describe,expect,test} from 'vitest'
import request  from 'supertest'
import { CreateAppInstace } from '../../app.mjs'
import { CreateSequelizeInstance, RemoveDatabaseTest } from '../../database/orm/sequelize.mjs';
import { HTTP_STATUS } from '../../consts/http-status.mjs';
import { createJWT, verifyJWT } from '../../utils/token.mjs';

const database=CreateSequelizeInstance("test")
const app=CreateAppInstace(database);
beforeAll(async ()=>{
    await database.sync()
})

describe("Testing User Routes",()=>{
    const CreateUsersTestTable=[
        [{name:"brunao",email:"eaiman",password:"fklajsfkasjfkas",},HTTP_STATUS.BAD_REQUEST],
        [{name:null,email:null,password:null,},HTTP_STATUS.BAD_REQUEST],
        [{name:"fasfa",email:null,password:null,},HTTP_STATUS.BAD_REQUEST],
        [{name:"Brunao",email:"abfn0905@gmail.com",password:"123456",},HTTP_STATUS.OK],//1
        [{name:"usuario ja existe",email:"abfn0905@gmail.com",password:"1234565125",},HTTP_STATUS.CONFLICT],
        [{name:"Brunao2",email:"abfn09010@gmail.com",password:"123456",},HTTP_STATUS.OK],//2
        [{name:"Brunao3",email:"abfn0906@gmail.com",password:"123456",},HTTP_STATUS.OK],//3
        [{name:"Brunao4",email:"abfn0907@gmail.com",password:"123456",},HTTP_STATUS.OK],//4
        [{name:"Brunao5",email:"abfn0908@gmail.com",password:"123456",},HTTP_STATUS.OK],//5
        [{name:"Brunao6",email:"abfn0909@gmail.com",password:"123456",},HTTP_STATUS.OK],//6
    ]
    describe.each(CreateUsersTestTable)("Testing Register User \nBody:%j\n \nstatusCode %d\n",(body,expectedStatusCode)=>{
        test("POST /users/",async ()=>{
            const res=await request(app).post('/users/').send(body)
            expect(res.statusCode).toBe(expectedStatusCode)
        })
    })
    const LoginUsersTestTable=[
        [{email:null,password:"uma senha errada",},HTTP_STATUS.UNAUTHORIZED],
        [{email:null,password:null,},HTTP_STATUS.UNAUTHORIZED],
        [{email:"abfn0905@gmail.com",password:"uma senha errada",},HTTP_STATUS.UNAUTHORIZED],
        [{email:"abfn0905@gmail.com",password:"123456",},HTTP_STATUS.OK],
        [{email:"user@naoexiste.com.org",password:"123456",},HTTP_STATUS.UNAUTHORIZED],
    ]

    describe.each(LoginUsersTestTable)("Testing Autenticate User \nbody: %j\n \nstatusCode: %d\n",(body,expectedStatusCode)=>{
        test("POST /users/oauth",async ()=>{
            const res=await request(app).post('/users/oauth').send(body)
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

    const UpdateUsersTestTable=[
        [{name:"USUARIO NEM EXISTE",password:"FKLASJFKASJFKASJ",},createJWT({id:9999,email:"usuario@naoexite.org"}),HTTP_STATUS.UNAUTHORIZED],
        [{name:"DEVERIA FALHAR INCOSISTENCIA NO TOKEN",password:"FKLASJFKASJFKASJ",},createJWT({id:2,email:"abfn0905@gmail.com"}),HTTP_STATUS.UNAUTHORIZED],
        [{name:null,password:null,},createJWT({id:1,email:"abfn0905@gmail.com"}),HTTP_STATUS.BAD_REQUEST],
        [{name:"Brunao update name",password:null,},createJWT({id:1,email:"abfn0905@gmail.com"}),HTTP_STATUS.OK],
        [{name:null,password:"novasenha",},createJWT({id:1,email:"abfn0905@gmail.com"}),HTTP_STATUS.OK],
        [{name:null,password:"novasenha",},createJWT({id:1,email:"abfn0905@gmail.com"}),HTTP_STATUS.OK],
        [{name:"update Brunao2",password:"novasenha",},createJWT({id:2,email:"abfn09010@gmail.com"}),HTTP_STATUS.OK],
    ]
    describe.each(UpdateUsersTestTable)("Testing Update User \nbody:%j\n \ntoken:%s\n \nstatusCode:%d\n",(body,token,expectedStatusCode)=>{
        test("PUT /users/",async ()=>{
            const res=await request(app).put("/users/").send(body).set('authorization',token);
            expect(res.statusCode).toBe(expectedStatusCode)
            
        })
    })
    const DeleteUsersTestTable=[
        [createJWT({id:1,email:"abfn0905@gmail.com"}),HTTP_STATUS.OK],//1
        [createJWT({id:2,email:"abfn09010@gmail.com"}),HTTP_STATUS.OK],//2
        [createJWT({id:3,email:"abfn0906@gmail.com"}),HTTP_STATUS.OK],//3
        [createJWT({id:4,email:"abfn0907@gmail.com"}),HTTP_STATUS.OK],//4
        [createJWT({id:5,email:"abfn0908@gmail.com"}),HTTP_STATUS.OK],//5
        [createJWT({id:6,email:"abfn0909@gmail.com"}),HTTP_STATUS.OK],//6
        [createJWT({id:6,email:"abfn0909@gmail.com"}),HTTP_STATUS.UNAUTHORIZED],//6
        [createJWT({id:1,email:"abfn0905@gmail.com"}),HTTP_STATUS.UNAUTHORIZED],//6
    ]
    describe.each(DeleteUsersTestTable)("Testing DELETE User \ntoken:%s\n \nstatusCode:%d\n ",(token,expectedStatusCode)=>{
        test("DELETE /users/",async ()=>{
            const res=await request(app).delete("/users/").set('authorization',token);
            expect(res.statusCode).toBe(expectedStatusCode)
            
        })
    })




})

afterAll(async ()=>{
    await RemoveDatabaseTest(database);
})



