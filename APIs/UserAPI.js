//create mini-express applicaytion(seperate route)
import exp from 'express'
import {UserModel} from '../models/UserModels.js'
import {hash,compare} from 'bcryptjs'
import jwt from 'jsonwebtoken' //default export
import {verifyToken} from '../middlewares/verifyToken.js'

//const {sign}=jwt
export const userApp=exp.Router();


const { sign } = jwt;
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
  const signedToken=sign({email:user.email},process.env.SECRET_KEY,{expiresIn:"1h"})
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
   userApp.post("/users", async (req, res) => {
  try {
    const newUser = req.body;

    // hash password
    const hashedPassword = await hash(newUser.password, 5);
    newUser.password = hashedPassword;

    const newUserDoc = new UserModel(newUser);
    const result = await newUserDoc.save();

    res.status(201).json({ message: "user created", payload: result });
  } catch (err) {
    res.status(500).json({ message: "error", error: err.message });
  }
});

 //read all users(protected route)
 userApp.get("/users",verifyToken,async(req,res)=>{
   ///read all users from db
   let usersList=await UserModel.find();
   //send res
   res.status(200).json({message:"users",payload:usersList})
 })  ;
 userApp.get("/user",verifyToken,async(req,res)=>{
  //read user email from req
  const emailOfUser=req.user?.email;


 
  //find user by id
  const userObj=await UserModel.findOne({email:emailOfUser}).populate("cart.product")
  //if user not found
  if(!userObj){
    return res.status(404).json({message:"user not founddd"})
  }
  //send res
  res.status(200).json({message:"user",payload:userObj})
 })





 //update a user by id
 userApp.put("/users/:id",verifyToken,async(req,res)=>{
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
 userApp.delete("/users/:id",verifyToken,async(req,res)=>{
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
 //add product to cart
 /*
 userApp.put("/cart/product-id/:pid",verifyToken,async(req,res)=>{
  //get product id from url param
  let productId=req.params.pid;
  //GET CURRENT USER DETAILS
  const emailOfUser=req.user?.email;
  
  //add product to cart
  let result=await UserModel.findOneAndUpdate({email:emailOfUser},{$push:{cart:{product:productId}}})
 if(!result){
  res.status(401).json({message:"user not found"})
 }
res.status(200).json({message:"product added to cart"})});
*/




/*userApp.put("/cart/product-id/:pid",verifyToken,async(req,res)=>{
  //get product id from url param
  let productId=req.params.pid;
  //GET CURRENT USER DETAILS
  const emailOfUser=req.user?.email;
  //before add first shld check that product is alrdy in cart if yes them increment count else add

  let check=await UserModel.findOne({cart:{product:productId}})
  if(!check){

  //add product to cart
  if(productId){
  let result=await UserModel.findOneAndUpdate({email:emailOfUser},{$push:{cart:{product:productId}}})
 if(!result){
  res.status(401).json({message:"user not found"})
 }}
res.status(200).json({message:"product added to cart"})}
else {
  cart.count++;
}});
*/


userApp.put("/cart/product-id/:pid", verifyToken, async (req, res) => {
  const productId = req.params.pid;
  const emailOfUser = req.user?.email;

  // check if product already in cart
  const user = await UserModel.findOne({
    email: emailOfUser,
    "cart.product": productId
  });

  if (user) {
    // increment count
    await UserModel.updateOne(
      { email: emailOfUser, "cart.product": productId },
      { $inc: { "cart.$.count": 1 } }
    );
    return res.status(200).json({ message: "product count increased" });
  } else {
    // add new product
    await UserModel.updateOne(
      { email: emailOfUser },
      { $push: { cart: { product: productId, count: 1 } } }
    );
    return res.status(200).json({ message: "product added to cart" });
  }
});