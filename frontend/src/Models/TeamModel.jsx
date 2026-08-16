import {useContext, useState} from 'react'
import { model_context } from '../Context/ApiContext'
import { api } from '../Services/Api'
import {Check} from 'lucide-react'
import useAuth from '../hooks/UseAuth'


const TeamModel = () => {
  const [model,setmodel]=useContext(model_context)
  const [team_name, setteam_name] = useState('')
  const [description, setdescription] = useState('')
  const [team_id, setteam_id] = useState('')
  const [...context]=useAuth()
  const setrefreshed1=context[13]
  const {showToast,setshowToast,toastmessage,settoastmessage}=context[14]
  const [error, seterror] = useState(null)
  return (
    // border-zinc-800
    <div className="fixed flex justify-center items-center top-16 z-40 inset-x-0 bottom-0 bg-black/50 backdrop-blur-sm">
      <div  className='bg-zinc-950 border-zinc-600 border   rounded-2xl md:w-[440px] h-[340px] w-full p-6 shadow-2xl animate-slide-up flex gap-2 m-3 flex-col self-start'>
          <h2 className="text-white font-bold text-lg">Create New Team</h2>
          <form action=""
          onSubmit={async(e)=>{
            e.preventDefault()
            try {
              const resp=await api.post('create-team/',{team_name,team_description: description})
              setrefreshed1((oldvalue)=>{ return oldvalue + 1})
              setteam_id(resp.data.team_id)
              settoastmessage('Team Created Successfully')
              setshowToast(true)
              setmodel(false)
            } catch (error) {
              settoastmessage('Failed to create the Team')
              setshowToast(true)
            }finally{
              setTimeout(() => {
                setshowToast(false)
                settoastmessage('')
              }, 2000);
            }
          }}
          >
            <div className="flex flex-col gap-2 pt-2">
              <span className="text-zinc-300 text-xs tracking-wider uppercase font-semibold">team name</span>
              <input type="text" className="w-full px-3.5 py-2 border border-zinc-700 text-zinc-300 rounded-2xl focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all px-4 bg-zinc-900 h-10" placeholder="e.g Frontend Engineers"
              value={team_name}
              onChange={(e)=>{
                setteam_name(e.target.value)
              }}
               />
            </div>
            <div className="flex flex-col gap-3 pt-3">
              <span className="text-zinc-300 text-xs tracking-wider uppercase font-semibold">description</span>
              <textarea type="text"  className="w-full    border border-zinc-700 text-zinc-300 rounded-2xl focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all px-4 bg-zinc-900 pt-2 h-25" placeholder="What is this Team Working on?"
              value={description}
              onChange={(e)=>{
                setdescription(e.target.value)
              }}
               />
            </div>
            <div className="flex pt-4  gap-3  justify-end pt-2">
              <button className="min-w-[5rem]   bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer " onClick={()=>{
                setmodel(false)
              }}>Cancel</button>
              <button type='submit' className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all cursor-pointer flex items-center justify-center min-w-[5rem]">
              {/* there will  be an api call */}
              Create
              </button>
            </div>
          </form>
        </div> 
        
    </div>
  )
}

export default TeamModel

 
