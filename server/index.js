import express from 'express'
import mongoose from 'mongoose'
import  dotenv from 'dotenv'
dotenv.config()

const app=express()
app.use(express.json())

const PORT= process.env.PORT || 5000
const MongoDB = async ()=>{
    const connect= await mongoose.connect(process.env.MONGODB_URL)
    if(connect){
        console.log('connected to database')
    }
}



app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`)
    MongoDB().catch((err)=>{console.error(err)})
})