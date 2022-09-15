
import  { Router } from  "express";
let RouterUsers=Router()
RouterUsers.post('/',(req,res)=>{});
RouterUsers.get('/',(req,res)=>{});
RouterUsers.get('/:id',(req,res)=>{});
RouterUsers.put('/:id',(req,res)=>{});
RouterUsers.delete('/:id',(req,res)=>{});
export default RouterUsers;