import React, { useEffect, useState } from 'react'
import './App.css'
import copy from './copy-two-paper-sheets-interface-symbol.png'
import axios from 'axios'
function App() {
    const [url,setUrl]=useState('')
    const [slug,setSlug]=useState('')
    const [shortLink,setShortLink]=useState('')
    const [link,setLink]=useState([])

    const generatelink= async ()=>{
        const obj={
            url:url,
            slug:slug
        }
        try{
            const responce = await axios.post('/link',obj)
            setShortLink(responce?.data?.data?.shortUrl);
        }catch(err){
            console.log(err.message)
        }
    }

   const copylink = ()=>{
   navigator.clipboard.writeText(shortLink)
   alert('Copied')
   }

   const loadLink = async ()=>{
      const responce = await axios.get('/api/links')
      setLink(responce?.data?.data)
   }
   useEffect(()=>{
    loadLink();
   },[])
  return (
    <div className='contanier'>
        <div className='sub-contanier'>
           <p className='title'>🔗 Generate Link</p>
           <div>
            <input 
            type="text" 
            placeholder='Enter URL here...'
            value={url}
            onChange={(e)=>{setUrl(e.target.value)}}
            className='input-box'
            />
            <input 
            type="text" 
            placeholder='Custom Slug (optional)...'
            value={slug}
            onChange={(e)=>{setSlug(e.target.value)}}
            className='input-box'
            />
           </div>
           <div className='short-cont'>
             <input 
             type="text" 
             placeholder='Generated Link'
             value={shortLink}
             className='input-box'
             disabled
             />
             <img src={copy} alt="" className='copy-btn' onClick={copylink} />
           </div>
           <button type='button' className='btn' onClick={generatelink}>Generate</button>
        </div>
        <div className='sub-contanier'>
         <p className='title'>🔗 All Links</p>

         <div>
            {link?.map((obj,index)=>{
                const {url,slug,click}=obj
                return(
                    <>
                     <div key={index} className='link-contanier'>
                        <p>URL: {url}</p>
                        <p>
                            Custom slug : {process.env.REACT_APP_BASE_URL}/{slug}
                        </p>
                        <p>click : {click} </p>
                     </div>
                    </>
                )
            })}
         </div>

        </div>
    </div>
  )
}

export default App
