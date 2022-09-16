import { HTTP_STATUS } from '../../config/http-status.mjs'

export function CreateUser(req,res){
    try{
        const { name,email,password } = req.body
        
        return res.status(HTTP_STATUS.OK).json({msg:"05_SUCCESS"})
    }
    catch(err){
        console.log(err)
    }
}
export async function ListUser(req,res){
    try{
        
    }
    catch(err){
        console.log(err)
    }
}
export async function GetUser(req,res){
    try{
        
    }
    catch(err){
        console.log(err)
    }
}
export async function UpdateUser(req,res){
    try{
        
    }
    catch(err){
        console.log(err)
    }
}
export async function DeleteUser(req,res){
    try{
        
    }
    catch(err){
        console.log(err)
    }
}