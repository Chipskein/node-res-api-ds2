import {describe,expect,test} from 'vitest'
import request  from 'supertest'

import { CreateAppInstace } from '../../app.mjs'
import { InitDatabaseTest,RemoveDatabaseTest } from '../../config/sequelize'

const app=CreateAppInstace();

describe("Testing Users Routes",async ()=>{
    const db=await InitDatabaseTest()
    test("POST users/",()=>{
        console.log(db.models)
    });


    await RemoveDatabaseTest(db)
})



