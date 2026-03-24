import jwt from 'jsonwebtoken'
const {verify}=jwt
export function verifyToken(req,res,next){
    //token verification logic
    const token=req.cookies?.token;
    //if req from unauth user
    if(!token){
      return res.status(401).json({message:"please login"})
    }
    try{
    //if token is existed
    const decodedToken = verify(token, process.env.SECRET_KEY);
    console.log(decodedToken);
    req.user=decodedToken;
    //call next
    next();
}catch(err){
res.status(401).json({message:"session expires.plz re-login"})
}
}