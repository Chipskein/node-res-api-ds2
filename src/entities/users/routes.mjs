
import  { Router } from  "express";
import { verifyToken } from "../../middlewares/auth.mjs";
import {RegisterUser,AutenticateUser,ListUser,GetUser,UpdateUser,DeleteUser} from './controller.mjs'
let RouterUsers=Router()

RouterUsers.post('/',RegisterUser);
RouterUsers.post('/oauth',AutenticateUser);

RouterUsers.get('/',ListUser);
RouterUsers.get('/:id',GetUser);

RouterUsers.put('/',verifyToken,UpdateUser);
RouterUsers.delete('/',verifyToken,DeleteUser);
export default RouterUsers;