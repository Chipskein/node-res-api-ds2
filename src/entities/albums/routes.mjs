
import  { Router } from  "express";
import { CreateAlbum, DeleteAlbum, GetAlbum, ListAlbum, UpdateAlbum } from './controller.mjs'
let RouterAlbums=Router()
RouterAlbums.post('/',CreateAlbum);
RouterAlbums.get('/',ListAlbum);
RouterAlbums.get('/:id',GetAlbum);
RouterAlbums.put('/:id',UpdateAlbum);
RouterAlbums.delete('/:id',DeleteAlbum);
export default RouterAlbums;