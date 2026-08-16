import React, { useState } from 'react'
import {Sparkles,Plus} from 'lucide-react'
import TeamModel from '../Models/TeamModel'
import {useContext} from 'react'
import { model_context } from '../Context/ApiContext'
const HeroSection = () => {
  
  const [model,setmodel]=useContext(model_context)
  return (
    <div className='min-h-30   gap-5  p-8 md:px-10  flex  flex-col md:flex-row md:items-center justify-between border-b border-zinc-800/80 '>
        <div className='flex  flex-col items-start gap-2'>
            <h1 className='flex items-center gap-2 font-extrabold tracking-tight text-3xl text-white'>Workspace Dashboard <Sparkles size={20} className='text-indigo-400 hover:text-indigo-300' /></h1>
            
            <span className='text-zinc-400 text-sm tracking-wide'>Open a team workspace to create, edit, and track tasks.</span>
        </div>
        <button className=' flex justify-center items-center gap-2 px-8 bg-gradient-to-r from-indigo-499 to-violet-600 hover:from-indigo-597 hover:to-violet-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all cursor-pointer  h-15 md:h-10 rounded-2xl md:w-45 max-w-[550px] ' onClick={()=>{
          setmodel(true)
        }}><Plus size={15}  /> Create Team</button>
        {model && <TeamModel />}
    </div>
  )
}

export default HeroSection
