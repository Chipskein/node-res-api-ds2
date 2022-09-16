import jwt from 'jsonwebtoken';
const Sign = process.env.JWT_SECRET;
const JWT_CONFIG={
    expiresIn:"7d"
}
export function createJWT(data){
    return jwt.sign(data,Sign,JWT_CONFIG)
}
export function verifyJWT(token){
    return jwt.verify(token,Sign,JWT_CONFIG)
}
