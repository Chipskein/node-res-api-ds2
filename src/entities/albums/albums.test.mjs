import {beforeAll, describe,expect,test} from 'vitest'
import request  from 'supertest'
import { CreateAppInstace } from '../../app.mjs'
import { CreateSequelizeInstance, RemoveDatabaseTest } from '../../config/sequelize.mjs';
import { HTTP_STATUS } from '../../config/http-status.mjs';
import { createJWT, verifyJWT } from '../../utils/token.mjs';
import Users from '../users/model.mjs';
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

})

describe("Testing Albums Routes",()=>{
    test("Preparing Users For Test",async ()=>{
        const usersForTest=await Users.findAll();
        expect(usersForTest.length).greaterThan(0);
    })
    const CreateAlbumsTest=[
        [createJWT({id:1,email:"email@email.com"}),"album_name",new Date(),"should fail",[],HTTP_STATUS.BAD_REQUEST],
        [createJWT({id:1,email:"email@email.com"}),"album_name",new Date(),"should fail",[],HTTP_STATUS.BAD_REQUEST],
        [createJWT({id:1,email:"email@email.com"}),"album_name","2020-09-02",["Jonh More"],[],HTTP_STATUS.BAD_REQUEST],
        [createJWT({id:1,email:"email@email.com"}),"album_name",new Date(),["random_author"],[],HTTP_STATUS.OK],
    ];
    describe.each(CreateAlbumsTest)("Testing Create Album ",(token,name,release_date,authors,musics,expectedStatusCode)=>{
        test("POST /albums/",async ()=>{
            const res=await request(app).post('/albums/').send({
                name,
                release_date,
                authors,
                musics
            }).set('Authorization',token)
            expect(res.statusCode).toBe(expectedStatusCode)
        })
    })



})

afterAll(async ()=>{
    await RemoveDatabaseTest(database);
})



