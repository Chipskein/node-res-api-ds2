import { config } from 'dotenv';
config();
import { CreateAppInstace } from './app.mjs';
const PORT=process.env.PORT || 3001;  
const app = CreateAppInstace()
app.listen(PORT,() => console.log(`Listing on PORT ${PORT}`))