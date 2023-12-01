import express from 'express'
import mongoose from 'mongoose'
import  dotenv from 'dotenv'
dotenv.config()
import Link from './models/Link.js'
import path from 'path'

const app=express()
app.use(express.json())

const __dirname= path.resolve()


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

    if(!link){
        return res.json({
            success:false,
            message:"No such link found"
        })
    }

    await Link.updateOne({slug:slug}, {$set:{
        click:link.click+1
    }})
    
    res.redirect(link.url)
 })


 app.get('/api/links', async (req,res)=>{
    const links=await Link.find({});
    res.json({
        success: true,
        data:links,
        message: "All links fetched successfully!"
        });
 })

 if(process.env.NODE_ENV=== "production"){
    app.use(express.static(path.join(__dirname,'..','client','build')))

    app.get('*', (req,res)=>{
        res.sendFile(path.join(__dirname,'..','client','build','index.html'))
    })
 }


const PORT= process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`)
    MongoDB().catch((err)=>{console.error(err)})
})