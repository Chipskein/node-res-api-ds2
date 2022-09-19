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
        [createJWT({id:3,email:"email@email.com"}),"album_name2",new Date(),["invalids user"],[],HTTP_STATUS.UNAUTHORIZED],
        [createJWT({id:1,email:"email@email.com"}),null,"0000000","should fail",[],HTTP_STATUS.BAD_REQUEST],
        [createJWT({id:1,email:"email@email.com"}),"album_name3","0000000","should fail",[],HTTP_STATUS.BAD_REQUEST],
        [createJWT({id:1,email:"email@email.com"}),"album_name4","2020-09-12","should fail",[],HTTP_STATUS.BAD_REQUEST],
        [createJWT({id:1,email:"email@email.com"}),"album_name5","2020-09-02",["Jonh More"],[],HTTP_STATUS.OK],
        [createJWT({id:1,email:"email@email.com"}),"album_name5","2020-09-02",["Jonh More"],null,HTTP_STATUS.OK],
        [createJWT({id:1,email:"email@email.com"}),"album_name6","5000-09-02",["random_author"],[],HTTP_STATUS.BAD_REQUEST],
        [createJWT({id:1,email:"email@email.com"}),"album_name7","string random",["random_author"],[],HTTP_STATUS.BAD_REQUEST],
        [createJWT({id:1,email:"email@email.com"}),"album_name8","20-09-2000",["random_author"],[],HTTP_STATUS.BAD_REQUEST],
        [createJWT({id:1,email:"email@email.com"}),"album_name9","2020-09-02",["Jonh More"],"faksfjkasjf",HTTP_STATUS.BAD_REQUEST],
        [createJWT({id:1,email:"email@email.com"}),"album_name9","2020-09-02",["Jonh More"],[{name:"musicteste",duration:104,formats:['ogg','mp3']}],HTTP_STATUS.OK],
        [createJWT({id:1,email:"email@email.com"}),"album_name9","2020-09-02",["Jonh More"],[{name:"musicteste",duration:104,formats:['ogg','mp3'],authors:["joselito"]}],HTTP_STATUS.OK],
        [createJWT({id:1,email:"email@email.com"}),"album_name9","2020-09-02",["Jonh More"],[{name:"musicteste",duration:104,formats:412412412,authors:["joselito"]}],HTTP_STATUS.BAD_REQUEST],
        [createJWT({id:1,email:"email@email.com"}),"album_name9","2020-09-02",["Jonh More"],[{name:null,duration:{},formats:412412412,authors:"null"}],HTTP_STATUS.BAD_REQUEST],
        [createJWT({id:1,email:"email@email.com"}),"album_name9","2020-09-02",["Jonh More"],[{name:"musicteste",duration:["should be a number"],formats:['ogg'],authors:["joselito"]}],HTTP_STATUS.BAD_REQUEST],
        [createJWT({id:1,email:"email@email.com"}),"album_name9","2020-09-02",["Jonh More"],[{name:"musicteste",duration:1.534,formats:['ogg'],authors:["joselito"]}],HTTP_STATUS.BAD_REQUEST],
        [createJWT({id:1,email:"email@email.com"}),"album_name9","2020-09-02",["Jonh More"],[{name:null,duration:50,formats:['ogg'],authors:["joselito"]}],HTTP_STATUS.BAD_REQUEST],
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

    test("GET /albums/",async ()=>{
        const token=createJWT({id:1,email:"email@email.com"})
        const res=await request(app).get('/albums/').send().set('Authorization',token)
        expect(res.statusCode).toBe(HTTP_STATUS.OK)
        expect(res.body.count).toBeGreaterThanOrEqual(0);
        expect(res.body.albums.length).toBeGreaterThanOrEqual(0);
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
        [2,HTTP_STATUS.OK],
        [3,HTTP_STATUS.OK],
        [4,HTTP_STATUS.OK],
        [5,HTTP_STATUS.OK],
        [6,HTTP_STATUS.OK],
        [7,HTTP_STATUS.OK],
        [8,HTTP_STATUS.OK],
        [9999999,HTTP_STATUS.NOT_FOUND],
    ]
    describe.each(GetUsersTestTable)("Testing Get Album Id:%d",(id,expectedStatusCode)=>{
        test("GET /albums/:id",async ()=>{
            const token=createJWT({id:1,email:"email@email.com"})
            const res=await request(app).get(`/albums/${id}`).set('Authorization',token)
            expect(res.statusCode).toBe(expectedStatusCode)
        })
    })


})

afterAll(async ()=>{
    await RemoveDatabaseTest(database);
})



