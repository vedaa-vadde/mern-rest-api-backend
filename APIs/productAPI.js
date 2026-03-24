//create mini express app(separate route)
import exp from 'express'
import {productModel} from '../models/productModels.js'
export const productApp=exp.Router();

productApp.post("/products",async(req,res)=>{
    const newProduct=req.body;
    const newProductDoc=new productModel(newProduct);
    const result=await newProductDoc.save();
    console.log("result:",result)
    res.status(201).json({message:"product created"});
});
productApp.get("/products",async(req,res)=>{
    let productList=await productModel.find();
    res.status(200).json({message:"products",payload:productList})

});
productApp.get("/products/:id",async(req,res)=>{
const pid=req.params.id;
const pObj=await productModel.findOne({productId:pid})
if(!pObj){
    return res.status(404).json({message:"product not found"})
}
res.status(200).json({message:"product",payload:pObj})
})
productApp.put("/products/:id",async(req,res)=>{
    const modifiedProduct=req.body;
    const pid=req.params.id;
    const updatedProduct=await productModel.findOneAndUpdate({productId:pid},{$set:{...modifiedProduct}},{new:true,runValidators:true});
    res.status(200).json({message:"product modified",payload:updatedProduct})
})
productApp.delete("/products/:id",async(req,res)=>{
    let pid=req.params.id;
    let deletedProduct=await productModel.findOneAndDelete({ productId: pid })
    if(!deletedProduct){
        return res.status(404).json({message:"product not found"})
    }
    res.status(200).json({message:"product removed",payload:deletedProduct})
})
//update a product by id
//del a product by id