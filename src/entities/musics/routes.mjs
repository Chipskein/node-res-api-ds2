
import  { Router } from  "express";
import {CreateMusic,ListMusic,GetMusic,UpdateMusic,DeleteMusic} from './controller.mjs'
let RouterMusics=Router()
RouterMusics.post('/',CreateMusic);
RouterMusics.get('/',ListMusic);
RouterMusics.get('/:id',GetMusic);
RouterMusics.put('/:id',UpdateMusic);
RouterMusics.delete('/:id',DeleteMusic);
export default RouterMusics;