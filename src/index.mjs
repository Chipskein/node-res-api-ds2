import express from 'express';
import usersRoutes from './entities/users/routes.mjs';
import albumsRoutes from './entities/albums/routes.mjs';
import musicsRoutes from './entities/musics/routes.mjs';
const PORT=process.env.PORT || 3001;  
const app = express();
app.use("/users",usersRoutes)
app.use("/albums",albumsRoutes)
app.use("/musics",musicsRoutes)
app.listen(PORT,() => console.log(`Listing on PORT ${PORT}`))