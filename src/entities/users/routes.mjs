
import  { Router } from  "express";
import {RegisterUser,LoginUser,ListUser,GetUser,UpdateUser,DeleteUser} from './controller.mjs'
let RouterUsers=Router()
RouterUsers.post('/',RegisterUser);
RouterUsers.post('/login',LoginUser);
RouterUsers.get('/',ListUser);
RouterUsers.get('/:id',GetUser);
RouterUsers.put('/:id',UpdateUser);
RouterUsers.delete('/:id',DeleteUser);
export default RouterUsers;