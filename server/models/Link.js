import { Schema,model } from "mongoose";

const linkSchema=new Schema({
    url :{
        type:String,
        required:[true,"Please enter a URL"]
    },
    slug:{
        type:String,
        unique:true
    },
    click:{
        type:Number,
        required:true,
        default:0
    }
},
{
    timestamps:true 
})

const Link=model('Link',linkSchema)

export default Link