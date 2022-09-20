import { HTTP_STATUS } from "../../consts/http-status.mjs"
import Musics from "../musics/model.mjs"
import Albums from "./model.mjs"
import Users from '../users/model.mjs'
import {isAValidDate} from '../../utils/date.mjs'

export async function CreateAlbum(req,res){
    try{
        const { id:userId }=req.user
        const {name,release_date,authors,musics}=req.body
        if(!name||!release_date||!Array.isArray(authors)||(musics&&!Array.isArray(musics))){
            throw {
                status:HTTP_STATUS.BAD_REQUEST,
                msg:"Invalid fields"
            }
        }
        if(!isAValidDate(release_date)){
            throw {
                status:HTTP_STATUS.BAD_REQUEST,
                msg:"Invalid Date"
            }
        }
        const {dataValues:album}=await Albums.create({
            name,
            release_date,
            authors:authors.join(','),
            userId
        })
        if(musics&&musics.length==0||!musics){
            return res.status(HTTP_STATUS.OK).json({album})
        }
        const ValidMusics=[];
        for await(let music of musics){        
            const {duration,name,formats,authors} =music
            if(!duration||(duration&&!Number.isInteger(parseFloat(duration)))||!name||(name&&typeof name!='string')||!formats||formats&&!Array.isArray(formats)||(authors&&!Array.isArray(authors))){
                throw {
                    status:HTTP_STATUS.BAD_REQUEST,
                    msg:"Invalid Musics Array in Request Body"
                }
            }
            ValidMusics.push({
                albumId:album.id,
                name,
                duration,
                formats:formats.join(','),
                authors: authors&&authors.length>0 ? authors.join(','):null,
            });
        }
        album.musics=await Musics.bulkCreate(ValidMusics,{returning:true})
        return res.status(HTTP_STATUS.OK).json({ album })
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}
export async function ListAlbum(req,res){
    
    try{
        let {offset,limit}=req.query
        if(!offset) offset=0;
        if(!limit) limit=10;
        const albums=[];
        const {rows,count}=await Albums.findAndCountAll({limit,offset,include:[Musics,Users]})
        rows.map(({dataValues})=>{
            let { id,name,release_date,authors,createdAt,updatedAt,userId,musics:fullmusics,user:fulluser}=dataValues
            const {dataValues:user}=fulluser;
            delete(user.password);
            const musics=[]
            fullmusics.map(({dataValues})=>{
                musics.push(dataValues);
            })
            albums.push({
                id,
                name,
                release_date,
                authors,
                createdAt,
                updatedAt,
                userId,
                musics,
                user
            })
        })
        return res.status(HTTP_STATUS.OK).json({albums,count})
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}
export async function GetAlbum(req,res){
    try{
        let { id } =req.params
        id=parseFloat(id)
        if(!id||Number.isNaN(id)||!Number.isInteger(id)){
            throw {
                status:HTTP_STATUS.BAD_REQUEST,
                message:"INVALID ALBUM ID, SHOULD BE A NUMBER"
            }
        }
        let fullalbum=await Albums.findByPk(id,{include:[Musics,Users]})
        if(!fullalbum){
            throw {
                status:HTTP_STATUS.NOT_FOUND,
                message:"Album Not Found"
            }
        }
        let {dataValues:album,user:fulluser,musics:fullmusics}=fullalbum;
        const {dataValues:user}=fulluser;
        delete(user.password);
        const musics=[];
        fullmusics.map(({dataValues})=>musics.push(dataValues));
        album.user=user;
        album.musics=musics;
        return res.status(HTTP_STATUS.OK).json({album});
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}
export async function UpdateAlbum(req,res){
    try{
        const {id:userId}=req.user
        let { id:albumId } =req.params

        const {id,name,authors,release_date} = req.body
        if(id){
            throw{
                status:HTTP_STATUS.BAD_REQUEST,
                message:"Can't Update ID field"
            }
        }
        if(!name&&!authors&&!release_date){
            throw{
                status:HTTP_STATUS.BAD_REQUEST,
                message:"There are no updateble fields in body request"
            }
        }
        if(name&&typeof name!='string'){
            throw{
                status:HTTP_STATUS.BAD_REQUEST,
                message:"name field should be a string"
            }
        }
        if(authors&&!Array.isArray(authors)){
            throw{
                status:HTTP_STATUS.BAD_REQUEST,
                message:"Authors should be a array of strings"
            }
        }
        if(release_date&&!isAValidDate(release_date)){
            throw{
                status:HTTP_STATUS.BAD_REQUEST,
                message:"release_date should be a valid date"
            }
        }
        const foundAlbum= await Albums.findByPk(albumId)
        if(!foundAlbum){
            throw{
                status:HTTP_STATUS.NOT_FOUND,
                message:"Album Not Found"
            }
        }
        const {dataValues:{userId:albumOwnerId}}=foundAlbum
        if(userId!=albumOwnerId){
            throw{
                status:HTTP_STATUS.FORBIDDEN,
                message:"You Are not owner of this album"
            }
        }



        const updateObj={};
        if(name) updateObj.name=name;
        if(release_date)updateObj.release_date=release_date;
        if(authors) updateObj.authors=authors.join(',');
        const {dataValues:album}=await foundAlbum.update(updateObj)
        return res.status(HTTP_STATUS.OK).json({album});
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}
export async function DeleteAlbum(req,res){
    try{
        const {id:userId}=req.user
        const { id }=req.body;
        if(!id){
            throw{
                status:HTTP_STATUS.BAD_REQUEST,
                message:"Album ID has not sent"
            }
        }
        if(id&&typeof id!='number'){
            throw{
                status:HTTP_STATUS.BAD_REQUEST,
                message:"Album ID should be a number"
            }
        }
        const foundAlbum=await Albums.findByPk(id)
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
                message:"You Are not owner of this album"
            }
        }
        await foundAlbum.destroy()
        return res.status(HTTP_STATUS.OK).json({msg:"05_DELETED"});
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}