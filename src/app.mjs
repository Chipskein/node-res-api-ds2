import express from 'express';
import usersRoutes from './entities/users/routes.mjs';
import albumsRoutes from './entities/albums/routes.mjs';
import musicsRoutes from './entities/musics/routes.mjs';
import { InitDatabase } from './config/sequelize.mjs';

export function CreateAppInstace(database){
    const app = express();
    InitDatabase(database)
    app.use(express.urlencoded({extended:true}));
    app.use(express.json());
    app.use("/users",usersRoutes)
    app.use("/albums",albumsRoutes)
    app.use("/musics",musicsRoutes)
    return app;
}