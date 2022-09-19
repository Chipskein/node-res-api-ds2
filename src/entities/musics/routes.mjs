
import  { Router } from  "express";
import { verifyToken } from "../../middlewares/auth.mjs";
import {CreateMusic,ListMusic,GetMusic,UpdateMusic,DeleteMusic} from './controller.mjs'
let RouterMusics=Router()
RouterMusics.post('/',verifyToken,CreateMusic);
RouterMusics.get('/',verifyToken,ListMusic);
RouterMusics.get('/:id',verifyToken,GetMusic);
RouterMusics.put('/:id',verifyToken,UpdateMusic);
RouterMusics.delete('/',verifyToken,DeleteMusic);
export default RouterMusics;