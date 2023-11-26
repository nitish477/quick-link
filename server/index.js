import express from 'express'
import mongoose from 'mongoose'
import  dotenv from 'dotenv'
dotenv.config()
import Link from './models/Link.js'

const app=express()
app.use(express.json())

const PORT= process.env.PORT || 5000
const MongoDB = async ()=>{
    const connect= await mongoose.connect(process.env.MONGODB_URL)
    if(connect){
        console.log('connected to database')
    }
}
const ramdonSlug=Math.random().toString(36).substring(2,7)

 app.post('/link', async(req,res)=>{
    const {url,slug}=req.body
    const link=new Link({
        url:url,
        slug:slug || ramdonSlug
    })

    try{
        const savedLink=await link.save()
      return  res.json({
           success:true,
           data:{
            shortUrl:`${process.env.BASE_URL}/${savedLink.slug}`
           },
           message:'Link generate Successfully'
        })
    } catch(err){
       return res.status(400).send(err)
    }
 })

 app.get('/:slug', async (req,res)=>{
    const {slug}=req.params
    const  link = await Link.findOne({slug:slug})
    await Link.updateOne({slug:slug}, {$set:{
        click:link.click+1
    }})
    if(!link){
        return res.json({
            success:false,
            message:"No such link found"
        })
    }

    res.redirect(link.url)
 })


app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`)
    MongoDB().catch((err)=>{console.error(err)})
})