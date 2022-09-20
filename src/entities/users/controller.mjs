import { HTTP_STATUS } from '../../consts/http-status.mjs';
import { hashPassword,verifyPassword } from '../../utils/password.mjs';
import { VerifyEmailSyntax } from '../../utils/email.mjs';
import { createJWT } from '../../utils/token.mjs'
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
        return res.status(statusCode).json({ msg: err.message})
    }
}
export async function AutenticateUser(req,res){
    try{
        const { email,password} = req.body
        if(!password||!email){
            throw {
                status:HTTP_STATUS.UNAUTHORIZED,
                message:"Invalid Credentials"
            }
        }

        const user=await Users.findOne({where:{email}})
        if(!user){
            throw {
                status:HTTP_STATUS.UNAUTHORIZED,
                message:"Invalid Credentials"
            }
        }


        const {dataValues:{password:hashedpassword,id}}=user
        if(!await verifyPassword(password,hashedpassword)){
            throw {
                status:HTTP_STATUS.UNAUTHORIZED,
                message:"Invalid Credentials"
            }
        }
        const token=createJWT({id,email})
        return res.status(HTTP_STATUS.OK).json({token})
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}
export async function ListUser(req,res){
    try{
        let {offset,limit}=req.query
        if(!offset) offset=0;
        if(!limit) limit=10;
        const users=[];
        const {rows,count}=await Users.findAndCountAll({limit,offset})
        rows.map(({dataValues})=>{
            const {id,email,name,createdAt,updatedAt}=dataValues
            users.push({id,email,name,createdAt,updatedAt});
        })
        return res.status(HTTP_STATUS.OK).json({users,count})
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}
export async function GetUser(req,res){
    try{
        let { id } =req.params
        id=parseFloat(id)
        if(!id||Number.isNaN(id)||!Number.isInteger(id)){
            throw {
                status:HTTP_STATUS.BAD_REQUEST,
                message:"INVALID USER ID, SHOULD BE A NUMBER"
            }
        }
        const user=await Users.findByPk(id)
        if(!user){
            throw {
                status:HTTP_STATUS.NOT_FOUND,
                message:"User Not Found"
            }
        }
        const {dataValues:{name,email,createdAt,updatedAt}}= user
        return res.status(HTTP_STATUS.OK).json({id,name,email,createdAt,updatedAt})
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}
export async function UpdateUser(req,res){
    try{
        const { id }=req.user;
        const {name,password}=req.body;
        if(!name&&!password){
            throw {
                status:HTTP_STATUS.BAD_REQUEST,
                message:"Missing Fields"
            }
        }
        const updateObj={};
        if(name){
            updateObj.name=name
        }
        if(password){
            updateObj.password=await hashPassword(password)
        }
        await Users.update(updateObj,{where: { id }});
        return res.status(HTTP_STATUS.OK).json({msg:"05_UPDATED"})
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}
export async function DeleteUser(req,res){
    try{
        const { id }=req.user;
        await Users.destroy({where:{id}});
        return res.status(HTTP_STATUS.OK).json({ message:"05_DELETED"});
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}