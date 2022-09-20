import { HTTP_STATUS } from '../consts/http-status.mjs'
import Users from '../entities/users/model.mjs';
import { verifyJWT } from '../utils/token.mjs';

export async function verifyToken(req,res,next){
    try{
        const token = req.headers['authorization'];
        if(!token){
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                msg:"Empty Authorization Token"
            })
        }
        const tokenInfo=verifyJWT(token)
        const { id,email } = tokenInfo;
        const user=await Users.findByPk(id)
        if(!user){
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                msg:"Invalid Token Information"
            })
        }
        const {dataValues:{email:userEmail,id:userId}}=user
        if(userEmail!=email||id!=userId){
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                msg:"Invalid Token Information"
            })
        }
        req.user=tokenInfo;
        next();
    } catch(err){
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            msg:"Invalid Authorization Token"
        })
    }
    
}
