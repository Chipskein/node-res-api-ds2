import express from 'express';
import usersRoutes from './entities/users/routes.mjs';
import albumsRoutes from './entities/albums/routes.mjs';
import musicsRoutes from './entities/musics/routes.mjs';
export function CreateAppInstace(database){
    const app = express();
    app.use(express.urlencoded({extended:true}));
    app.use(express.json());
    app.use("/users",usersRoutes)
    app.use("/albums",albumsRoutes)
    app.use("/musics",musicsRoutes)
    return app;
}