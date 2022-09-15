
import  { Router } from  "express";
import {CreateUser,ListUser,GetUser,UpdateUser,DeleteUser} from './controller.mjs'
let RouterUsers=Router()
RouterUsers.post('/',CreateUser);
RouterUsers.get('/',ListUser);
RouterUsers.get('/:id',GetUser);
RouterUsers.put('/:id',UpdateUser);
RouterUsers.delete('/:id',DeleteUser);
export default RouterUsers;