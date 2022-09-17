import express from 'express';
import usersRoutes from './entities/users/routes.mjs';
import albumsRoutes from './entities/albums/routes.mjs';
import musicsRoutes from './entities/musics/routes.mjs';
import { InitSequelizeModels,RunAssociationFromDBModels } from './config/sequelize.mjs';

export function CreateAppInstace(database){
    const app = express();
    InitSequelizeModels(database)
    RunAssociationFromDBModels(database)
    database.sync().then(data=>console.log("Database Synced")).catch(err=>console.log(err))
    app.use(express.urlencoded({extended:true}));
    app.use(express.json());
    app.use("/users",usersRoutes)
    app.use("/albums",albumsRoutes)
    app.use("/musics",musicsRoutes)
    return app;
}