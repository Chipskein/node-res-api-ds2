import { HTTP_STATUS } from '../../config/http-status.mjs';
import { hashPassword } from '../../utils/password.mjs';
import { VerifyEmailSyntax } from '../../utils/email.mjs';
import Users from './model.mjs';
export async function RegisterUser(req,res){
    try{
        const { name,email,password } = req.body
        if(!name||!email||!password){
            throw {
                status:HTTP_STATUS.BAD_REQUEST,
                message:"Missing fields in request"
            }
        }
        if(!VerifyEmailSyntax(email)){
            throw {
                status:HTTP_STATUS.BAD_REQUEST,
                message:"Invalid Email"
            }
        }
        const user=await Users.findAll({where:{email}})
        if(user.length!=0){
            throw {
                status:HTTP_STATUS.CONFLICT,
                message:"User Already Exists"
            }
        }
        
        const hashedpass=await hashPassword(password)
        await Users.create({
            name,
            email,
            password:hashedpass
        })
        return res.status(HTTP_STATUS.OK).json({msg:"05_SUCCESS"})
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ message: err.message})
    }
}
export function LoginUser(req,res){
    try{
        const { name,email} = req.body
        if(!name||!email){
            throw Error({
                status:HTTP_STATUS.BAD_REQUEST,
                message:"Invalid Body"
            })
        }



        
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ message: err.message})
    }
}
export async function ListUser(req,res){
    try{
        
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ message: err.message})
    }
}
export async function GetUser(req,res){
    try{
        
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ message: err.message})
    }
}
export async function UpdateUser(req,res){
    try{
        
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ message: err.message})
    }
}
export async function DeleteUser(req,res){
    try{
        
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ message: err.message})
    }
}