
import  { Router } from  "express";
import { verifyToken } from "../../middlewares/auth.mjs";
import {RegisterUser,LoginUser,ListUser,GetUser,UpdateUser,DeleteUser} from './controller.mjs'
let RouterUsers=Router()

RouterUsers.post('/',RegisterUser);
RouterUsers.post('/login',LoginUser);

RouterUsers.get('/',ListUser);
RouterUsers.get('/:id',GetUser);

RouterUsers.put('/',verifyToken,UpdateUser);
RouterUsers.delete('/',verifyToken,DeleteUser);
export default RouterUsers;