import { config } from 'dotenv';
config();
export default{
    dialect:"postgres",
    uri:process.env.DATABASE_URL,
}