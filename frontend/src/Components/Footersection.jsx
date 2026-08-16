import React, { useEffect, useState } from "react";
import {api} from '../Services/Api.js'

import {Briefcase,MoveUpRight,MoveRight, FolderOpen, Users } from "lucide-react";
import {Link, useNavigate} from 'react-router-dom'
import useAuth from "../hooks/UseAuth";


const Footersection = () => {
  const [teamid, setteamid] = useState('')
  const [error, seterror] = useState(null)
  const [...context]=useAuth()
  const refreshed1=context[12]
  const [teams_data, setteams_data] = useState([])
  const {user, loading } = context[14]
  useEffect(() => {
    async function getdata (){
    const resp= await api.get("get-teams/")
    setteams_data(resp.data.data)
  }
   getdata() 
  }, [loading,refreshed1])
  let information=<p className="text-xl text-white font-bold tracking-wider">Loading....</p>
  if (teams_data.length>0) {
    information=teams_data.map((elem,idx)=>{
      return <Link key={idx} className="border border-rose-50   rounded-2xl cursor-pointer bg-zinc-950/40 border-1 h-[200px]  w-full p-5 hover:border-indigo-500 transition-all shadow-xl flex  flex-col gap-2"  
    to={`/TeamDashboard/${elem.id}`}
    >
        <h2 className="font-bold text-white tracking-tight text-lg flex  justify-between">{elem.team_name} <MoveUpRight className="text-zinc-400 text-xs hover:translate-x-1 hover:-translate-y-1 transition-transform duration-300 " size={17} /></h2>
        <span className=" mb-3 text-zinc-400 text-xs font-semibold">{elem.team_description}</span>
        <button className="mt-4 h-8 max-w-38 text-xs font-semibold text-indigo-400 rounded-xl cursor-pointer flex justify-between bg-indigo-510/10 hover:bg-indigo-500/20 border border-indigo-500/30 items-center px-2 inline-flex" >
          <Briefcase className="" size={20}/>
          <p className="">Manage Tasks</p>
          <MoveRight  size={19} />
        </button>
        <div className=" pt-3 border-t border-zinc-900 flex flex-wrap justify-between items-center text-[10px] text-zinc-500 font-medium">
          <span>id#{elem.id}</span>
          <span>Creator:{elem.created_by_username}</span>
        </div>
        </Link>
    })
  }
  useEffect(()=>{
    if (error) {
      const timer=setTimeout(()=>{
        seterror(null)
      },3000)
      return ()=>clearTimeout(timer)
    }
  })
  const navigate=useNavigate()

  return (
    <div className="flex  flex-col md:flex-row md:justify-between  gap-6 p-4">
      {/* Left Section */}
      <div className="flex-1 min-w-0">
        <h2 className="px-8   font-bold text-lg tracking-tight text-white flex items-center gap-2">
        <Users className="text-indigo-500 text-lg " />
        My Teams
      </h2>
      <div className='grid grid-cols-2 items-start   gap-5 py-4 px-4'>
        {information}
      </div>
      </div>
      {/* Right Section */}
      <div className="h-[220px] shrink-0 max-w-[390px] w-full bg-zinc-950/40 border border-zinc-800/80 rounded-2xl p-6 ml-10 shadow-xl  md:mr-8 space-y-4">
      <div className="h-full w-full flex flex-col gap-2">
        <h2 className="flex items-start gap-2 font-bold text-lg tracking-tight text-white"><FolderOpen className="text-indigo-500 text-lg" />Open Team by ID</h2>
        <p className="text-zinc-400 text-xs">Direct numeric navigation to a team workspace. Useful as a backup or for rapid entry.</p>
        <form action="" onSubmit={(e)=>{
          e.preventDefault()
          if (!teamid || !Number.isInteger(Number(teamid))) {
            seterror('Please Provide Valid Team ID')
          }else{
            navigate(`/TeamDashboard/${teamid}`)  
          }
          
        }} >
          {error && <p className="text-xs border border-red-400/50 rounded-2xl px-2 py-0.5 min-w-full text-red-400 font-medium tracking-wider">{error}</p>}
          <div >
            <input type="text" placeholder="Enter numeric team ID" className="w-full px-3 py-2 bg-zinc-900 border mt-3 border-zinc-800 focus:border-indigo-500 rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
            value={teamid} onChange={(e)=>{
            setteamid(e.target.value)
          }}
            />
          </div>
          <button type="submit"  className="w-full mt-4 flex items-center justify-center gap-1.5 py-2 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer group">
            <span>Navigate to team</span>
            <MoveRight className="text-sm text-white" size={12} />
          </button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default Footersection;
