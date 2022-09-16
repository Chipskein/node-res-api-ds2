import {compare,hash,genSalt} from 'bcrypt'
const saltRounds=10;
export async function verifyPassword(password,hash){
    return await compare(password,hash);
}
export async function hashPassword(password){
    const salt=await genSalt(saltRounds);
    return await hash(password,salt);
}