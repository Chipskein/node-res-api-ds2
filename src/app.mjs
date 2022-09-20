import express from 'express';
import usersRoutes from './entities/users/routes.mjs';
import albumsRoutes from './entities/albums/routes.mjs';
import musicsRoutes from './entities/musics/routes.mjs';
import { InitDatabase } from './database/orm/sequelize.mjs';
import { HTTP_STATUS } from './consts/http-status.mjs';
import path from 'path'
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function CreateAppInstace(database){
    const app = express();
    InitDatabase(database)
    app.use(express.urlencoded({extended:true}));
    app.use(express.json());
    app.get("/",(req,res)=>{
        return res.sendFile(path.join(__dirname,'pages','index.html',))
    })
    app.use("/users",usersRoutes)
    app.use("/albums",albumsRoutes)
    app.use("/musics",musicsRoutes)
    app.use("*",(req,res)=>{
        return res.status(HTTP_STATUS.NOT_FOUND).json({msg:"Resource not found"})
    })
    return app;
}