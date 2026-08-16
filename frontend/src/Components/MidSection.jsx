import React, { useEffect, useState } from 'react'
import {TriangleAlert,CircleCheckBig,Circle,TrendingUp} from 'lucide-react'
import { api } from '../Services/Api'


const MidSection = () => {
    const [stats, setstats] = useState({})
    const [error, seterror] = useState(null)
    useEffect(() => {
        async function get_data() {
            try {
                const resp=await api('statistics/')
                
                setstats(resp.data)

                
            } catch (error) {
                seterror('Failed to load statistics')
            }
        }
        get_data()
    }, [])
    
  return (
    <div className='p-10 '>
        <div className='flex items-center gap-2'>
            <TrendingUp size={18}  className='text-indigo-500' />
            <h2 className='text-xl tracking-tight text-white font-bold'>Global Task Statistics</h2>
        </div>
        
        {error ? (
          <p className='text-red-400 text-sm text-center mt-6'>{error}</p>
        ) :(
        <div className='grid grid-cols-2 md:flex gap-5  md:justify-between md:items-center m-10'>
            <div className='rounded-2xl  border flex flex-col  p-5 gap-1 border-zinc-300 hover:border-none h-[100px] max-w-[290px] md:w-[290px]'>
                <p className='text-zinc-500 text-xs font-semibold tracking-wider uppercase'>Total Tasks</p>
                <p className='font-bold text-4xl text-white'>{stats.total_tasks}</p>
            </div>
            <div className='rounded-2xl border flex flex-col  p-5 gap-1 border-zinc-300 hover:border-none h-[100px] max-w-[290px] md:w-[290px]'>
                <p className='text-zinc-500 flex justify-between text-xs font-semibold tracking-wider uppercase'>In progress <Circle className='fill-yellow-600 text-yellow-600 ' size={12} /></p>
                <p className='font-bold text-4xl text-white'>{stats.In_progress}</p>
            </div>
            <div className='rounded-2xl border flex flex-col  p-5 gap-1 border-zinc-300 hover:border-transparent h-[100px] max-w-[290px] md:w-[290px]'>
                <p className='flex justify-between text-zinc-500 text-xs font-semibold tracking-wider uppercase'>Completed <CircleCheckBig className='text-green-400' size={20}/></p>
            <p className='font-bold text-4xl text-white'>{stats.Completed}</p>
            </div>
            <div className='rounded-2xl border flex flex-col  p-5 gap-1 border-zinc-300 hover:border-none h-[100px] max-w-[490px] md:w-[290px]'>
                <p className='text-zinc-500 flex justify-between text-xs font-semibold tracking-wider uppercase'>OverDue <TriangleAlert className='text-red-400' size={15} /></p>
                <p className='font-bold text-4xl text-white'>{stats.over_due_tasks}</p>
            </div>
        </div>
            )}
    </div>
  )
}

export default MidSection