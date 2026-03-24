import {Schema,model,Types} from 'mongoose'
//create cart schema {product, count}
const cartSchema=new Schema({
    product:{
         type:Types.ObjectId,
         ref:"product"//name of the product model
    },
    count:{
        type:Number,
        default:1
    }
})
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
    cart:[cartSchema]
},
{
    versionKey:false,
    timestamps:true,
},);

//generate userModel
export const UserModel=model("user",userSchema)