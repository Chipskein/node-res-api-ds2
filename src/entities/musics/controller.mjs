import { HTTP_STATUS } from "../../config/http-status.mjs";
import Users from "../users/model.mjs";
import Musics from "./model.mjs";
import Albums from "../albums/model.mjs";

export async function CreateMusic(req,res){
    try{
        const {id:userId}=req.user
        const {name,duration,formats,authors,albumId} = req.body;
        if(!name||!duration||!formats||!albumId){
            throw{
                status:HTTP_STATUS.BAD_REQUEST,
                message:"Missing fields to create resource"
            }
        }
        if(typeof name!='string'){
            throw{
                status:HTTP_STATUS.BAD_REQUEST,
                message:"Name Field Should be a string"
            }
        }
        if(!Number.isInteger(parseFloat(duration))){
            throw{
                status:HTTP_STATUS.BAD_REQUEST,
                message:"Duration Field should be a number"
            }
        }
        if(!Array.isArray(formats)){
            throw{
                status:HTTP_STATUS.BAD_REQUEST,
                message:"Formats Fields Should be an array of strings"
            }
        }
        if(formats.length==0){
            throw{
                status:HTTP_STATUS.BAD_REQUEST,
                message:"Formats Field should not be empty"
            }
        }
        if(authors&&!Array.isArray(authors)){
            throw{
                status:HTTP_STATUS.BAD_REQUEST,
                message:"Authors Field should be an array of strings"
            }
        }
        if(authors&&authors.length==0){
            throw{
                status:HTTP_STATUS.BAD_REQUEST,
                message:"Authors is empty"
            }
        }
        const foundAlbum=await Albums.findByPk(albumId);
        if(!foundAlbum){
            throw{
                status:HTTP_STATUS.NOT_FOUND,
                message:"Album not found"
            }
        }
        const {dataValues:{userId:albumOwnerId}}=foundAlbum;
        if(userId!=albumOwnerId){
            throw{
                status:HTTP_STATUS.FORBIDDEN,
                message:"You are not owner of album resource"
            }
        }

        const music=await Musics.create({
            albumId,
            name,
            duration,
            formats: formats&&formats.length>0 ? formats.join(','):null,
            authors: authors&&authors.length>0 ? authors.join(','):null,
        })
        
        return res.status(HTTP_STATUS.OK).json({music});
    }
    catch(err){
        console.log(err);
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}
export async function ListMusic(req,res){
    try{
        const {id:userId}=req.user
        return res.status(HTTP_STATUS.OK).json({msg:""});
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
    
}
export async function GetMusic(req,res){
    try{
        const {id:userId}=req.user
        return res.status(HTTP_STATUS.OK).json({msg:""});
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}
export async function UpdateMusic(req,res){
    try{
        const {id:userId}=req.user
        return res.status(HTTP_STATUS.OK).json({msg:""});
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}
export async function DeleteMusic(req,res){
    try{
        const {id:userId}=req.user
        return res.status(HTTP_STATUS.OK).json({msg:""});
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}