import express from 'express';
import usersRoutes from './users/routes.mjs';
import albumsRoutes from './albums/routes.mjs';
import musicsRoutes from './musics/routes.mjs';
const PORT=process.env.PORT || 3001;  
const app = express();
app.use("/users",usersRoutes)
app.use("/albums",albumsRoutes)
app.use("/musics",musicsRoutes)
app.listen(PORT,() => console.log(`Listing on PORT ${PORT}`))