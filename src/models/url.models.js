import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    originalUrl:{
        type:String,
        required:true
    },
    title:{
        type:String,
    },
    shortCode:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    clicks:{
        type:Number,
        default:0
    },
    expiresAt:{
        type:Date,
    }

},{timestamps:true})

const UrlModel = mongoose.model("Url",urlSchema); 
export {UrlModel};