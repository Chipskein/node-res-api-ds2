import {beforeAll, describe,expect,test} from 'vitest'
import request  from 'supertest'
import { CreateAppInstace } from '../../app.mjs'
import { CreateSequelizeInstance, RemoveDatabaseTest } from '../../database/orm/sequelize.mjs';
import { HTTP_STATUS } from '../../consts/http-status.mjs';
import { createJWT } from '../../utils/token.mjs';
import Users from '../users/model.mjs';
import Albums from '../albums/model.mjs';
const database=CreateSequelizeInstance("test")
const app=CreateAppInstace(database);
beforeAll(async ()=>{
    await database.sync()
    const UsersForThisTest=[
        ["name","email@email.com","password"],//1
        ["name","email2@email.com","password"],//2
        ["name","email3@email.com","password"],//3
    ]
    await Promise.allSettled(
        UsersForThisTest.map(async ([name,email,password])=>{
            await Users.create({
                name,email,password
            })
        })
    )
    const AlbumsForThisTest=[
        ["album de teste 1",1,new Date(),["fasjfkajsfkas","buuboo","lhll"]],//1
        ["album de teste 2",2,new Date(),["dasdf","fafas"]],//2
        ["album de teste 3",3,new Date(),["dfasfas"]],//3
        ["album de teste 4",1,new Date(),["gugu"]],//4
    ];
    await Promise.allSettled(
        AlbumsForThisTest.map(async ([name,userId,release_date,authors])=>{
            await Albums.create({
                name,
                userId,
                release_date,
                authors:authors.join(',')
            })
        })
    )

})

describe("Testing Musics Routes",()=>{
    test("Preparing Users For Test",async ()=>{
        const usersForTest=await Users.findAll();
        expect(usersForTest.length).greaterThan(0);
    })
    test("Preparing Albums For Test",async ()=>{
        const albums=await Albums.findAll();
        expect(albums.length).greaterThan(0);
    })

    const CreateMusicsTest=[
        [createJWT({id:1,email:"email@email.com"}),{name:null,duration:null,formats:null,authors:null,albumId:null},HTTP_STATUS.BAD_REQUEST],
        [createJWT({id:2,email:"email2@email.com"}),{name:"testando",duration:123,formats:['ogg'],authors:null,albumId:1},HTTP_STATUS.FORBIDDEN],
        [createJWT({id:1,email:"email@email.com"}),{name:"testando",duration:123,formats:['ogg'],authors:null,albumId:1},HTTP_STATUS.OK],
        [createJWT({id:1,email:"email@email.com"}),{name:{},duration:123,formats:['ogg'],authors:null,albumId:1},HTTP_STATUS.BAD_REQUEST],
        [createJWT({id:1,email:"email@email.com"}),{name:"fasfasf",duration:{"falhe":1},formats:['ogg'],authors:null,albumId:1},HTTP_STATUS.BAD_REQUEST],
        [createJWT({id:1,email:"email@email.com"}),{name:"f",duration:123,formats:[],authors:null,albumId:1},HTTP_STATUS.BAD_REQUEST],
        [createJWT({id:1,email:"email@email.com"}),{name:"f",duration:123,formats:["ogg"],authors:[],albumId:1},HTTP_STATUS.BAD_REQUEST],
        [createJWT({id:1,email:"email@email.com"}),{name:"f",duration:123,formats:["ogg"],authors:["fasfasf"],albumId:null},HTTP_STATUS.BAD_REQUEST],
        [createJWT({id:1,email:"email@email.com"}),{name:"f",duration:123,formats:["ogg"],authors:["fasfasf"],albumId:9999999},HTTP_STATUS.NOT_FOUND],
        [createJWT({id:2,email:"email2@email.com"}),{name:"testando1",duration:123,formats:['ogg'],authors:null,albumId:3},HTTP_STATUS.FORBIDDEN],
        [createJWT({id:1,email:"email@email.com"}),{name:"testando2",duration:123,formats:['ogg'],authors:null,albumId:1},HTTP_STATUS.OK],
        [createJWT({id:1,email:"email@email.com"}),{name:"testando3",duration:123,formats:['ogg'],authors:null,albumId:1},HTTP_STATUS.OK],
        [createJWT({id:1,email:"email@email.com"}),{name:"testando4",duration:123,formats:['ogg'],authors:null,albumId:1},HTTP_STATUS.OK],
    ];

    describe.each(CreateMusicsTest)("Testing Create Album \ntoken:%s\n \nbody:%j\n",(token,body,expectedStatusCode)=>{
        test("POST /musics/",async ()=>{
            const res=await request(app).post('/musics').send(body).set('Authorization',token)
            expect(res.statusCode).toBe(expectedStatusCode)
        })
    })


    test("GET /musics/",async ()=>{
        const token=createJWT({id:1,email:"email@email.com"})
        const res=await request(app).get('/musics/').set('Authorization',token)
        expect(res.statusCode).toBe(HTTP_STATUS.OK)
        expect(res.body.count).toBeGreaterThanOrEqual(0);
        expect(res.body.musics.length).toBeGreaterThanOrEqual(0);
    })

    const GetMusicsTestTable=[
        [12431241,HTTP_STATUS.NOT_FOUND],
        [2.5,HTTP_STATUS.BAD_REQUEST],
        ["asfafsa",HTTP_STATUS.BAD_REQUEST],
        [{},HTTP_STATUS.BAD_REQUEST],
        [1,HTTP_STATUS.OK],
        [2,HTTP_STATUS.OK],
        [3,HTTP_STATUS.OK],
        [4,HTTP_STATUS.OK],
        [99999,HTTP_STATUS.NOT_FOUND],
    ]
    describe.each(GetMusicsTestTable)("Testing Get Music Id:%d",(id,expectedStatusCode)=>{
        test("GET /musics/:id",async ()=>{
            const token=createJWT({id:1,email:"email@email.com"})
            const res=await request(app).get(`/musics/${id}`).set('Authorization',token)
            expect(res.statusCode).toBe(expectedStatusCode)
        })
    })

    const UpdateMusicsTestTable=[
        [null,{},createJWT({id:1,email:"email@email.com"}),HTTP_STATUS.BAD_REQUEST],
        [999999,{name:null,duration:null,formats:null,authors:null},createJWT({id:1,email:"email@email.com"}),HTTP_STATUS.BAD_REQUEST],
        [999999,{name:"tentando alterar nome",duration:null,formats:null,authors:null},createJWT({id:1,email:"email@email.com"}),HTTP_STATUS.NOT_FOUND],
        [1,{name:"tentando alterar nome deveria bloquear",duration:null,formats:null,authors:null},createJWT({id:2,email:"email2@email.com"}),HTTP_STATUS.FORBIDDEN],
        [1,{name:"tentando alterar nome",duration:null,formats:null,authors:null},createJWT({id:1,email:"email@email.com"}),HTTP_STATUS.OK],
        [1,{name:"tentando alterar nome",duration:"fasfasf",formats:null,authors:null},createJWT({id:1,email:"email@email.com"}),HTTP_STATUS.BAD_REQUEST],
        [1,{name:"tentando alterar nome",duration:124124,formats:[],authors:null},createJWT({id:1,email:"email@email.com"}),HTTP_STATUS.BAD_REQUEST],
        [1,{name:"tentando alterar nome",duration:124124,formats:["wav","mov"],authors:null},createJWT({id:1,email:"email@email.com"}),HTTP_STATUS.OK],
        [1,{name:"tentando alterar nome",duration:124124,formats:["wav","mov"],authors:[]},createJWT({id:1,email:"email@email.com"}),HTTP_STATUS.BAD_REQUEST],
        [1,{name:"tentando alterar nome",duration:124124,formats:["wav","mov"],authors:["autor random"]},createJWT({id:1,email:"email@email.com"}),HTTP_STATUS.OK],
        [1,{id:22,name:"tentando alterar nome",duration:124124,formats:["wav","mov"],authors:["autor random"]},createJWT({id:1,email:"email@email.com"}),HTTP_STATUS.BAD_REQUEST],
        [1,{name:"tentando alterar nome",duration:124124,formats:["wav","mov"],authors:["autor random"],},createJWT({id:1,email:"email@email.com"}),HTTP_STATUS.OK],
        [1,{albumId:29,},createJWT({id:1,email:"email@email.com"}),HTTP_STATUS.NOT_FOUND],
        [1,{albumId:4,},createJWT({id:1,email:"email@email.com"}),HTTP_STATUS.OK],
        [1,{albumId:2,},createJWT({id:1,email:"email@email.com"}),HTTP_STATUS.FORBIDDEN],
        [1,{albumId:"fasfasfasf"},createJWT({id:1,email:"email@email.com"}),HTTP_STATUS.BAD_REQUEST],
            
    ]
    describe.each(UpdateMusicsTestTable)("Testing Update Music \nId:%d\n \nBody:%j\n \ntoken:%s\n \nstatusCode:%d\n",(id,body,token,expectedStatusCode)=>{
        test("PUT /musics/:id",async ()=>{
            const res=await request(app).put(`/musics/${id}`).send(body).set('Authorization',token)
            expect(res.statusCode).toBe(expectedStatusCode)
        })
    })



    const DeleteMusicsTestTable=[
        [{id:2},createJWT({id:2,email:"email2@email.com"}),HTTP_STATUS.FORBIDDEN],
        [{id:1},createJWT({id:1,email:"email@email.com"}),HTTP_STATUS.OK],
        [{id:null},createJWT({id:1,email:"email@email.com"}),HTTP_STATUS.BAD_REQUEST],
        [{id:"fasfasfasfa"},createJWT({id:1,email:"email@email.com"}),HTTP_STATUS.BAD_REQUEST],
        [{id:8195815871025870125},createJWT({id:1,email:"email@email.com"}),HTTP_STATUS.NOT_FOUND],
        [{id:81958.15871025870125},createJWT({id:1,email:"email@email.com"}),HTTP_STATUS.NOT_FOUND],
        [{id:{}},createJWT({id:1,email:"email@email.com"}),HTTP_STATUS.BAD_REQUEST],
        [{id:1},createJWT({id:1,email:"email@email.com"}),HTTP_STATUS.NOT_FOUND],
        [{id:2},createJWT({id:1,email:"email@email.com"}),HTTP_STATUS.OK],
        [{id:3},createJWT({id:1,email:"email@email.com"}),HTTP_STATUS.OK],
    ]
    describe.each(DeleteMusicsTestTable)("Testing Delete Music \nBody:%j\n \ntoken:%s\n \nstatusCode:%d\n",(body,token,expectedStatusCode)=>{
        test("DELETE /musics/",async ()=>{
            const res=await request(app).delete(`/musics/`).send(body).set('Authorization',token)
            expect(res.statusCode).toBe(expectedStatusCode)
        })
    })

})

afterAll(async ()=>{
    await RemoveDatabaseTest(database);
})



