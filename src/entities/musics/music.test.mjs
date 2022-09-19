import {beforeAll, describe,expect,test} from 'vitest'
import request  from 'supertest'
import { CreateAppInstace } from '../../app.mjs'
import { CreateSequelizeInstance, RemoveDatabaseTest } from '../../config/sequelize.mjs';
import { HTTP_STATUS } from '../../config/http-status.mjs';
import { createJWT, verifyJWT } from '../../utils/token.mjs';
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


})

afterAll(async ()=>{
    await RemoveDatabaseTest(database);
})



