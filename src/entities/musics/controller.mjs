import { HTTP_STATUS } from "../../consts/http-status.mjs";
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
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}
export async function ListMusic(req,res){
    try{
        let {offset,limit}=req.query
        if(!offset) offset=0;
        if(!limit) limit=10;
        const musics=[];
        const {rows,count}=await Musics.findAndCountAll({limit,offset,include:[{model:Albums,include:[Users]}]});
        rows.map(({dataValues})=>{
            let { id,name,release_date,formats,duration,authors,createdAt,updatedAt,album:fullalbum}=dataValues
            const {dataValues:album}=fullalbum
            const {user:fulluser}=album
            const {dataValues:user}=fulluser
            delete(user.password);
            album.user=user;
            musics.push({
                id,
                name,
                release_date,
                formats:formats&&formats.length>0 ? formats.split(','):null,
                duration,
                authors:authors&&authors.length>0 ? authors.split(','):null,
                createdAt,
                updatedAt,
                album
            })
        })
        return res.status(HTTP_STATUS.OK).json({musics,count});
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
    
}
export async function GetMusic(req,res){
    try{
        let { id } =req.params
        id=parseFloat(id)
        if(!id||Number.isNaN(id)||!Number.isInteger(id)){
            throw {
                status:HTTP_STATUS.BAD_REQUEST,
                message:"INVALID Music ID, SHOULD BE A NUMBER"
            }
        }
        let fullMusic=await Musics.findByPk(id,{include:[{model:Albums,include:[Users]}]})
        if(!fullMusic){
            throw {
                status:HTTP_STATUS.NOT_FOUND,
                message:"Music Not Found"
            }
        }
        let {dataValues:{name,release_date,formats,duration,authors,createdAt,updatedAt,album:fullalbum}}=fullMusic;
        const {dataValues:album}=fullalbum
        const {user:fulluser}=album
        const {dataValues:user}=fulluser
        delete(user.password);
        album.user=user;
        const music={
            id,
            name,
            release_date,
            formats:formats&&formats.length>0 ? formats.split(','):null,
            duration,
            authors:authors&&authors.length>0 ? authors.split(','):null,
            createdAt,
            updatedAt,
            album
        }
        

        return res.status(HTTP_STATUS.OK).json({music});
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}
export async function UpdateMusic(req,res){
    try{
        const {id:userId}=req.user
        let { id:musicId } =req.params
        const {id,name,authors,duration,formats,albumId} = req.body
        if(id){
            throw{
                status:HTTP_STATUS.BAD_REQUEST,
                message:"Can't Update ID field"
            }
        }
        if(!name&&!authors&&!duration&&!formats&&!albumId){
            throw{
                status:HTTP_STATUS.BAD_REQUEST,
                message:"There are no updateble fields in body request"
            }
        }
        if(name&&typeof name!='string'){
            throw{
                status:HTTP_STATUS.BAD_REQUEST,
                message:"Name Field Should be a string"
            }
        }
        if(duration&&!Number.isInteger(parseFloat(duration))){
            throw{
                status:HTTP_STATUS.BAD_REQUEST,
                message:"Duration Field should be a number"
            }
        }
        if(albumId&&!Number.isInteger(parseFloat(albumId))){
            throw{
                status:HTTP_STATUS.BAD_REQUEST,
                message:"albumId Field should be a number"
            }
        }
        if(formats&&!Array.isArray(formats)){
            throw{
                status:HTTP_STATUS.BAD_REQUEST,
                message:"Formats Fields Should be an array of strings"
            }
        }
        if(formats&&formats.length==0){
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
        const foundMusic= await Musics.findByPk(musicId,{include:{model:Albums,include:Users}})
        if(!foundMusic){
            throw{
                status:HTTP_STATUS.NOT_FOUND,
                message:"Music Not Found"
            }
        }
        const {dataValues:{album:fullalbum}}=foundMusic;
        const {dataValues:album}=fullalbum;
        const {userId:albumOwnerId}=album;
        if(userId!=albumOwnerId){
            throw{
                status:HTTP_STATUS.FORBIDDEN,
                message:"You Are not owner of this resource"
            }
        }
        const updateObj={};
        if(name) updateObj.name=name;
        if(duration) updateObj.duration=duration;
        if(formats) updateObj.formats=formats.join(',');
        if(authors) updateObj.authors=authors.join(',');
        if(albumId){
            const foundnewAlbum = await Albums.findByPk(albumId);
            if(!foundnewAlbum){
                throw{
                    status:HTTP_STATUS.NOT_FOUND,
                    message:"Could Not Found new Album resource"
                }
            }
            const {dataValues:newAlbum}=foundnewAlbum
            const {userId:albumOwnerId}=newAlbum;
            if(userId!=albumOwnerId){
                throw{
                    status:HTTP_STATUS.FORBIDDEN,
                    message:"You are not owner of new Album to move the music file"
                }
            }
            updateObj.albumId=albumId;
        }
        const music=await foundMusic.update(updateObj);
        return res.status(HTTP_STATUS.OK).json({music});
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}
export async function DeleteMusic(req,res){
    try{
        const {id:userId}=req.user
        const { id }=req.body;
        if(!id){
            throw{
                status:HTTP_STATUS.BAD_REQUEST,
                message:"Music ID has not sent"
            }
        }
        if(id&&typeof id!='number'){
            throw{
                status:HTTP_STATUS.BAD_REQUEST,
                message:"Music ID should be a number"
            }
        }
        const foundMusic=await Musics.findByPk(id,{include:Albums})
        if(!foundMusic){
            throw{
                status:HTTP_STATUS.NOT_FOUND,
                message:"Music not found"
            }
        }
        const {dataValues:{album:{userId:albumOwnerId}}}=foundMusic;;
        if(userId!=albumOwnerId){
            throw{
                status:HTTP_STATUS.FORBIDDEN,
                message:"You Are not owner of this music"
            }
        }
        await foundMusic.destroy()
        return res.status(HTTP_STATUS.OK).json({msg:"05_DELETED"});
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}