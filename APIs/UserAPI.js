//create mini-express applicaytion(seperate route)
import exp from 'express'
import {UserModel} from '../models/UserModels.js'
import {hash,compare} from 'bcryptjs'
import jwt from 'jsonwebtoken' //default export
import {verifyToken} from '../middlewares/verifyToken.js'
const {sign}=jwt
export const userApp=exp.Router();


//user login
userApp.post("/auth",async(req,res)=>{
  //get user obj from client
  const {email,password}=req.body;
  //verify email
  let user=await UserModel.findOne({email:email})
  //if email not existed
  if(!user){
    return res.status(400).json({message:"Inavlid email"})
  }
  //compare passwords
  let result=await compare(password,user.password)
  if(result===false){
    return res.status(400).json({message:"invalid password"})
  }
  //else create a token and send
  const signedToken=sign({email:user.email},"abcdef",{expiresIn:"1h"})
  //store token at httpOnly cookie
  res.cookie("token",signedToken,{
    httpOnly:true,
    sameSite:"lax",
    secure:false
  }
  )
  //send res
  res.status(200).json({message:"login success",payload:user})
})
//define user rest api routes
   //create new user
   userApp.post("/users",async(req,res)=>{
    //get new user obj from req
    
    const newUser=req.body;
    //hash the password
    const hashedPassword=await hash(newUser.password,10)
    //replace plain pasword with hashed password
    newUser.password=hashedPassword;
    //create new user doc
    const newUserDocument=new UserModel(newUser);
    //save
    const result=await newUserDocument.save();
    console.log("result:",result)
    //send response
    res.status(201).json({message:"user created"});
  
   });

 //read all users(protected route)
 userApp.get("/users",verifyToken,async(req,res)=>{
   ///read all users from db
   let usersList=await UserModel.find();
   //send res
   res.status(200).json({message:"users",payload:usersList})
 })  ;
 userApp.get("/users/:id",async(req,res)=>{
  //read onj id from req params
  const uid=req.params.id;
  //find user by id
  const userObj=await UserModel.findOne({_id:uid})
  //if user not found
  if(!userObj){
    return res.status(401).json({message:"user not founddd"})
  }
  //send res
  res.status(200).json({message:"user",payload:userObj})
 })





 //update a user by id
 userApp.put("/users/:id",async(req,res)=>{
  //get modified user from req
  const modifiedUser=req.body;
  const uid=req.params.id;
  //find user by id and update
  const updatedUser=await UserModel.findByIdAndUpdate(uid,{$set:{...modifiedUser}},{new:true,runValidators:true});
  //send res
  res.status(200).json({message:"user modified",payload:updatedUser})
 }
 )
 //delete user by id
 userApp.delete("/users/:id",async(req,res)=>{
  //get id from req param
  let uid=req.params.id;
  //find & delete user by id
  let deletedUser=await UserModel.findByIdAndDelete(uid)
if(!deletedUser)
{
  return res.status(404).json({message:"user not found"})
}
  //send res
  res.status(200).json({message:"user removed",payload:deletedUser})
 })