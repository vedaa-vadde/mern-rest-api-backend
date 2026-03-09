import {Schema,model} from 'mongoose'

//create user schema
const userSchema=new Schema({
    //structure of the user resource
    username:{
        type:String,
        required:[true,"UserName is required"],
        minLength:[4,"minimum length of user name is 4 characters"],
        maxLength:[6,"max length of user name is 6 characters"],
        
    },
    password:{
        type:String,
        required:[true,"password required"],
    },
    email:{
        type:String,
        required:[true,"email id required"],
        unique:[true,"email already exists"],
    },
    age:{
    type:Number
    },

},
{
    versionKey:false,
    timestamps:true,
},);

//generate userModel
export const UserModel=model("user",userSchema)