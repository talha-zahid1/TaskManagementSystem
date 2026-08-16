import React from 'react'
import {TriangleAlert} from 'lucide-react'
import { model_context } from "../Context/ApiContext";
import { useContext } from "react";
import useAuth from '../hooks/UseAuth';
import { api } from '../Services/Api';
import { useParams,useNavigate } from 'react-router-dom';


const DeleteModel = () => {
    const [,,taskmodel,setaskmodel,delmodel,setdelmodel]=useContext(model_context)
    const [...context]=useAuth()
    const navigate =useNavigate()
    const {showToast,setshowToast,toastmessage,settoastmessage}=context[14]
    const param=useParams()
  return (
    <div className="fixed flex justify-center items-center top-16 z-40 inset-x-0 bottom-0 bg-black/50 backdrop-blur-sm">
        <div className='flex justify-center items-center w-full p-13'>
            <div  className='bg-zinc-950 border-zinc-600 border   rounded-2xl md:w-[440px] h-[180px] w-full p-6 shadow-2xl animate-slide-up space-y-3 flex gap-2 m-3 flex-col self-start'>
                <div className='flex items-center gap-3 text-red-500'>
                    <TriangleAlert />
                    <h3 className='text-base font-bold text-white'>Delete Team</h3>
                </div>
                <p className='text-zinc-400 text-xs'>This will permanently delete the team, its members, and all tasks in this workspace.</p>
                <form onSubmit={async(e)=>{
                    e.preventDefault()
                    
                    try {
                        const resp=await api.delete(`teams/${param.id}/`)
                        settoastmessage('Team deleted Successfully')
                        setshowToast(true)
                        navigate('/Dashboard')
                    } catch (error) {
                        settoastmessage(error.response?.data?.message || 'Failed to delete the team')
                        setshowToast(true)
                    }finally{
                        setTimeout(() => {
                            setshowToast(false)
                            settoastmessage('')
                        }, 2000);
                        setdelmodel(false)
                        console.log(param.id)
                    }
                }}>
                    <div className='flex gap-3 justify-end pt-2'>
                    <button className='px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer'
                    onClick={()=>{
                        setdelmodel(false)
                    }}
                    >Cancel</button>
                    <button type='submit' className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center min-w-[6rem]'> Delete Team</button>
                </div>
                </form>
        </div>
        </div>
    </div>
  )
}

export default DeleteModel
