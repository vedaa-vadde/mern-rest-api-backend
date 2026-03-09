import {Schema,model} from 'mongoose'
const productSchema=new Schema({
    //structure of product resource
    productId:{
        type:Number,
        required:[true,"product id is required"],
        
    },
    productName:{
        type:String,
        required:[true,"product name is required"],
    },
    price:{
        type:Number,
        required:[true,"price of the roduct is required"],
        min:[10000,"minimum price of the product shoud be 10000"],
        max:[50000,"maximum price of the product should be 50000"],
    },
    brand:{
        type:String,
        required:[true,"brand should be mentioned"],
    },
},
{
    versionKey:false,
    timestamps:true,
},);
export const productModel=model("product",productSchema)