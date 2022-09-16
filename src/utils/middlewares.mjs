import { HTTP_STATUS } from '../config/http-status.mjs'
import { verifyJWT } from './token.mjs';
export async function verifyToken(req,res,next){
    try{
        const token = req.headers['authorization'];
        if(!token){
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                msg:"Empty Authorization Token"
            })
        }
        const tokenInfo=verifyJWT(token)
        req.data=tokenInfo;
        next();
    } catch(err){
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            msg:"Invalid Authorization Token"
        })
    }
    
}
