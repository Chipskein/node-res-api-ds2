
import  { Router } from  "express";
import { verifyToken } from "../../middlewares/auth.mjs";
import { CreateAlbum, DeleteAlbum, GetAlbum, ListAlbum, UpdateAlbum } from './controller.mjs'
let RouterAlbums=Router()
RouterAlbums.post('/',verifyToken,CreateAlbum);
RouterAlbums.get('/',verifyToken,ListAlbum);
RouterAlbums.get('/:id',verifyToken,GetAlbum);
RouterAlbums.put('/:id',verifyToken,UpdateAlbum);
RouterAlbums.delete('/',verifyToken,DeleteAlbum);
export default RouterAlbums;