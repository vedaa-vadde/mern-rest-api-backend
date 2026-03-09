import exp from 'express';
import {connect} from 'mongoose';
import { userApp} from './APIs/UserAPI.js';
import { productApp}from './APIs/productAPI.js';
import cookieParser from 'cookie-parser';
const app=exp();
app.use(exp.json())
app.use(cookieParser())
app.use("/user-api",userApp);
app.use("/product-api",productApp);

//use body parser middleware

//connect to db serv+er
async function connectToDb(){
    try{ 
        await connect('mongodb://localhost:27017/anurag');
        console.log('connected to db server successfully');
        

        app.listen(4000,()=>console.log("server is listening to port 4000..."))
    } catch (error) {
        console.error('error connecting to db server:', error)
    }
}
connectToDb();
//

//error handling middleware

app.use((err,req,res,next)=>{
   
    if(err.name==='ValidationError'){
        return res.status(400).json({message:"error occurred",error:err.message})
    }
    if(err.name==='CastError'){
        return res.status(400).json({message:"error occurred",error:err.message})
    }
    res.status(500).json({message:"error occured",error:"server side error"})

})
    

