import { HTTP_STATUS } from "../../config/http-status.mjs"
import Musics from "../musics/model.mjs"
import Albums from "./model.mjs"
import {isAValidDate} from '../../utils/date.mjs'
export async function CreateAlbum(req,res){
    try{
        const { id:userId }=req.user
        const {name,release_date,authors,musics}=req.body
        if(!name||!release_date||!Array.isArray(authors)){
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



        return res.status(HTTP_STATUS.OK).json({ msg: ""})
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}
export async function ListAlbum(req,res){
}
export async function GetAlbum(req,res){
}
export async function UpdateAlbum(req,res){
}
export async function DeleteAlbum(req,res){
}