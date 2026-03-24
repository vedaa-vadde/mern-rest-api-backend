/*export async(req,res)=>{
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
  
   }
    */