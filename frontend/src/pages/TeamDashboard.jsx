import { Link,useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import {
  Plus,
  Search,
  UsersRound,
  CalendarDays,
  User,
  Trash2,
  Pen,
  FileText,
  Dot,
  Briefcase,
  TrendingUp,
  Trash,
  MoveLeft,
  Shield,
} from "lucide-react";
import { model_context } from "../Context/ApiContext";
import { useContext, useEffect, useState } from "react";
import TaskModel from "../Models/TaskModel";
import EditModels from "../Models/EditModels";
import DeleteModel from "../Models/DeleteModel";
import { api } from "../Services/Api";
import useAuth from "../hooks/UseAuth";

let priority = "High";
const TeamDashboard = () => {
  const [...context]=useAuth()
  const [,,taskmodel,setaskmodel,delmodel,setdelmodel,editmodel,seteditmodel,task_id,settask_id,refreshed,setrefreshed]=useContext(model_context)
  const {user, loading,showToast,setshowToast,toastmessage,settoastmessage } = context[14]
  const [singleteam, setsingleteam] = useState(null)
  const [error, seterror] = useState(null)
  const [stats, setstats] = useState(null)
  const [taskdetails, settaskdetails] = useState([])
  const [members, setmembers] = useState([])
  const [n, setn] = useState(0)
  const [ref, setref] = useState(0)
  const [admin, setadmin] = useState('')
  const param=useParams()
  const [todo, settodo] = useState(0)
  const [prog, setprog] = useState(0)
  const [rev, setrev] = useState(0)
  const [comp, setcomp] = useState(0)
  const [username, setusername] = useState('')
  const [flag, setflag] = useState(true)
  const [searchresult, setsearchresult] = useState(null)
  const [role, setrole] = useState('Member')
  const [user_id, setuser_id] = useState(0)

  useEffect(() => {
    if (loading) {
      return
    }
    async function get_team() {
      try {
        const resp1=await api.get(`get-single-team/${param.id}`)
        const resp2=await api.get(`statistics/${param.id}`)
        const resp3=await api.get(`tasks/${param.id}`)
        const resp4=await api.get(`get-team-mem/${param.id}`)
        
        setmembers(resp4.data.members)     
        
        setn(resp4.data.members.length)
        setadmin(resp4.data.members.find((elem)=>{return elem.role.toLowerCase()==='admin' }))
        setsingleteam(resp1.data.data)
        setstats(resp2.data)
        setcomp(resp2.data.Completed)
        settodo(resp2.data.todo_tasks)
        
        setprog(resp2.data.In_progress)
        setrev(resp2.data.review_tasks)
        settaskdetails(resp3.data.task)
        
        
      } catch (error) {
        seterror(error.response?.data?.detail  || 'Failed to load team details')
      }

    }
    get_team()    
  }, [loading,param.id,refreshed,ref])
  let Team_members=<h1 className="text-red-400 w-70 rounded-2xl border border-red-300 text-sm px-3 font-semibold">Empty Team</h1>
  if (members.length>0) {
    Team_members=members.map((elem,idx)=>{
      
      return <div key={idx} className="flex items-center justify-between p-4 bg-zinc-900/40  border border-zinc-500 hover:border-zinc-900 rounded-2xl h-[80px]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8  rounded-lg bg-zinc-800/40 flex items-center justify-center border border-zinc-700" >
                <User className="text-indigo-400 text-xs" strokeWidth={1.5} size={18}/>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span  className="font-semibold text-white  text-sm ">{elem.username}</span>
                  {elem.role.toLowerCase()==='admin'&&<span className="text-[9px] px-1.5 pb-0.5  bg-zinc-950 border border-zinc-800 rounded-md font-medium text-zinc-400">Creator</span>}
                </div>
                <span className="text-[10px] text-zinc-500 font-medium">joined {new Date(elem.joined_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs px-2.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-300 font-medium">{elem.role}</span>
              {(elem.role.toLowerCase()==='member' && <button
              onClick={async(e)=>{
                try {
                  const respy=await api.post(`rem-team-mem/${param.id}/`,{team_id:param.id,user_id:elem.user_id,role:elem.role})
                  
                  setref((oldval)=>{return oldval+1})
                  settoastmessage('User Deleted')
                  setshowToast(true)
                } catch (error) {
                  settoastmessage(error.response?.data?.message||'Failed to Delete User ')
                  setshowToast(true)
              } finally{
                 setTimeout(() => {
                        setshowToast(false)
                        settoastmessage('')
                    }, 2000);
              }
              }}
              ><Trash className="text-zinc-500 hover:text-red-400 cursor-pointer" size={18} /></button>)}
            </div>
            </div>
    })
  }

  
  // const resp=await api.put(`tasks/${param.id}/`)
  let icon=<div className="flex flex-col mt-[50%] md:mt-[120%] items-center justify-center"><FileText className="text-zinc-500 text-xs  " size={40} /></div>
  let to_do=[]
  if (taskdetails.length>0) {
    to_do=taskdetails.filter((elem)=>{ return elem.status.toLowerCase().trim()==='to do'})
    
  }
  let to_do_tasks=''
  if (to_do.length==0) {
    to_do_tasks=icon
  }else{
    
  to_do_tasks=to_do.map((elem,idx)=>{
    
    return <div key={idx} className="group flex flex-col relative bg-zinc-900/60 border mt-4 border-zinc-500 hover:border-zinc-800 rounded-xl p-4 shadow-md hover:shadow-2xl transition-all duration-200 h-[170px]  ">
                  <div className="flex justify-between ">
                    <span
                      className={`px-3 py-0.5 rounded-full h-5  uppercase text-xs font-semibold ${
                        elem.priority.toLowerCase() === "high"
                        ? "bg-red-500/10 border border-red-500/30 text-red-400"
                        : elem.priority.toLowerCase() === "low"
                        ? "bg-blue-500/10 border border-blue-500/30 text-blue-500"
                        : "bg-yellow-500/10 border border-yellow-500/30 text-yellow-500"
                      }`}
                      >
                      {elem.priority} PRIORITY
                      
                    </span>
                    
                    <div className="inline-flex items-center gap-1">
                      <button className=" cursor-pointer border  px-2 h-8 w-8 flex items-center opacity-100 transition-opacity border-zinc-600 rounded-xl"><Pen className="text-xs text-zinc-400" size={14}
                      onClick={()=>{
                        settask_id(elem.id)
                        seteditmodel(true)
                      }}
                       /></button>
                       {editmodel &&<EditModels />}
                      <button className=" cursor-pointer border  px-2 h-8 w-8 flex items-center opacity-100 transition-opacity border-zinc-600 rounded-xl"
                      onClick={async(e)=>{
                        try {
                          const respg=await api.delete(`update-task/${elem.id}/`)
                          setref((oldval)=>{return oldval +1})
                          settoastmessage('Task deleted successfully')
                          setshowToast(true)
                        }catch (error) {
                    settoastmessage(error.response?.data?.message||'Task Deletion Failed')
                    setshowToast(true)
                }finally{
                    setTimeout(() => {
                        setshowToast(false)
                        settoastmessage('')
                    }, 2000);
                }
                      }}
                      ><Trash2 className="text-xs text-zinc-400" size={14}
                       /></button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold text-zinc-500">id #{elem.id}</p>
                    <h4 className="font-bold text-white text-sm line-clamp-1 group-hover:text-indigo-400 transition-colors">{elem.title}</h4>

                    <p className="text-zinc-400 text-xs line-clamp-2 min-h-[1.5rem]">
                      {elem.description}
                    </p>
                  </div>
                  <div className="flex  pt-3 justify-between border-t  border-zinc-950 text-[10px]">
                    <div className="flex inline-flex  gap-1 text-zinc-400 items-center">
                      <User className="font-bold text-lg text-indigo-400" size={17} />
                      <span className="pt-1 tracking-wide">{elem.assigned_to} </span>
                    </div>
                    <div className="flex inline-flex  gap-1 text-red-400 items-center">
                      <CalendarDays className="font-bold text-lg" size={17} />
                      <span className="pt-1 font-bold tracking-wide"> {new Date(elem.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
  })
  }
  let In_prog=[]
  if (taskdetails.length>0) {
    In_prog=taskdetails.filter((elem)=>{ return elem.status.toLowerCase().trim()==='progress'})
  }
  let In_prog_tasks=''
  if (In_prog.length==0) {
    In_prog_tasks=icon
  }else{
  In_prog_tasks=In_prog.map((elem,idx)=>{
    return <div key={idx} className="group flex flex-col relative bg-zinc-900/60 border mt-4 border-zinc-500 hover:border-zinc-800 rounded-xl p-4 shadow-md hover:shadow-2xl transition-all duration-200 h-[170px] gap-2 ">
                  <div className="flex justify-between ">
                    <span
                      className={`px-3 py-0.5 rounded-full h-5  uppercase text-xs font-semibold ${
                        elem.priority.toLowerCase() === "high"
                        ? "bg-red-500/10 border border-red-500/30 text-red-400"
                        : elem.priority.toLowerCase() === "low"
                        ? "bg-blue-500/10 border border-blue-500/30 text-blue-500"
                        : "bg-yellow-500/10 border border-yellow-500/30 text-yellow-500"
                      }`}
                      >
                      {elem.priority} PRIORITY
                    </span>
                    <div className="inline-flex items-center gap-1">
                      <button className=" cursor-pointer border  px-2 h-8 w-8 flex items-center opacity-100 transition-opacity border-zinc-600 rounded-xl"
                      onClick={()=>{
                        settask_id(elem.id)
                        seteditmodel(true)
                      }}
                      ><Pen className="text-xs text-zinc-400" size={14} /></button>
                      <button className=" cursor-pointer border  px-2 h-8 w-8 flex items-center opacity-100 transition-opacity border-zinc-600 rounded-xl"
                      onClick={async(e)=>{
                        try {
                          const respg=await api.delete(`update-task/${elem.id}/`)
                          setref((oldval)=>{return oldval +1})
                          settoastmessage('Task deleted successfully')
                          setshowToast(true)
                        }catch (error) {
                    settoastmessage(error.response?.data?.message||'Task Deletion Failed')
                    setshowToast(true)
                }finally{
                    setTimeout(() => {
                        setshowToast(false)
                        settoastmessage('')
                    }, 2000);
                }
                      }}
                      ><Trash2 className="text-xs text-zinc-400" size={14} /></button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-bold text-white text-sm line-clamp-1 group-hover:text-indigo-400 transition-colors">{elem.title}</h4>
                    <p className="text-zinc-400 text-xs line-clamp-2 min-h-[1.5rem]">
                      {elem.description}
                    </p>
                  </div>
                  <div className="flex  pt-3 justify-between border-t  border-zinc-950 text-[10px]">
                    <div className="flex inline-flex  gap-1 text-zinc-400 items-center">
                      <User className="font-bold text-lg text-indigo-400" size={17} />
                      <span className="pt-1 tracking-wide">M Talha(admin)</span>
                    </div>
                    <div className="flex inline-flex  gap-1 text-red-400 items-center">
                      <CalendarDays className="font-bold text-lg" size={17} />
                      <span className="pt-1 font-bold tracking-wide"> {new Date(elem.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
  })
  }
  let In_Review=''
  let In_Review_tasks=[]
  if (taskdetails.length>0) {
    In_Review_tasks=taskdetails.filter((elem)=>{ return elem.status.toLowerCase().trim()==='review'})
  }
  if (In_Review_tasks.length==0) {
    In_Review=icon
  }else{
  In_Review=In_Review_tasks.map((elem,idx)=>{
    return <div key={idx} className="group flex flex-col relative bg-zinc-900/60 border mt-4 border-zinc-500 hover:border-zinc-800 rounded-xl p-4 shadow-md hover:shadow-2xl transition-all duration-200 h-[170px] gap-2 ">
                  <div className="flex justify-between ">
                    <span
                      className={`px-3 py-0.5 rounded-full h-5  uppercase text-xs font-semibold ${
                        elem.priority.toLowerCase() === "high"
                        ? "bg-red-500/10 border border-red-500/30 text-red-400"
                        : elem.priority.toLowerCase() === "low"
                        ? "bg-blue-500/10 border border-blue-500/30 text-blue-500"
                        : "bg-yellow-500/10 border border-yellow-500/30 text-yellow-500"
                      }`}
                      >
                      {elem.priority} PRIORITY
                    </span>
                    <div className="inline-flex items-center gap-1">
                      <button className=" cursor-pointer border  px-2 h-8 w-8 flex items-center opacity-100 transition-opacity border-zinc-600 rounded-xl"
                      onClick={()=>{
                        settask_id(elem.id)
                        seteditmodel(true)
                      }}
                      ><Pen className="text-xs text-zinc-400" size={14} /></button>
                      <button className=" cursor-pointer border  px-2 h-8 w-8 flex items-center opacity-100 transition-opacity border-zinc-600 rounded-xl"
                      onClick={async(e)=>{
                        try {
                          const respg=await api.delete(`update-task/${elem.id}/`)
                          setref((oldval)=>{return oldval +1})
                          settoastmessage('Task deleted successfully')
                          setshowToast(true)
                        }catch (error) {
                    settoastmessage(error.response?.data?.message||'Task Deletion Failed')
                    setshowToast(true)
                }finally{
                    setTimeout(() => {
                        setshowToast(false)
                        settoastmessage('')
                    }, 2000);
                }
                      }}
                      ><Trash2 className="text-xs text-zinc-400" size={14} /></button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-bold text-white text-sm line-clamp-1 group-hover:text-indigo-400 transition-colors">{elem.title}</h4>
                    <p className="text-zinc-400 text-xs line-clamp-2 min-h-[1.5rem]">
                      {elem.description}
                    </p>
                  </div>
                  <div className="flex  pt-3 justify-between border-t  border-zinc-950 text-[10px]">
                    <div className="flex inline-flex  gap-1 text-zinc-400 items-center">
                      <User className="font-bold text-lg text-indigo-400" size={17} />
                      <span className="pt-1 tracking-wide">M Talha(admin)</span>
                    </div>
                    <div className="flex inline-flex  gap-1 text-red-400 items-center">
                      <CalendarDays className="font-bold text-lg" size={17} />
                      <span className="pt-1 font-bold tracking-wide"> {new Date(elem.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
  })
  }
  let Completed_tasks=''
  let Completed=[]
  if (taskdetails.length>0) {
    Completed=taskdetails.filter((elem)=>{ return elem.status.toLowerCase().trim()==='completed'})
  }
  if (Completed.length==0) {
    Completed_tasks=icon
  }else{
  Completed_tasks=Completed.map((elem,idx)=>{
    return <div key={idx} className="group flex flex-col relative bg-zinc-900/60 border mt-4 border-zinc-500 hover:border-zinc-800 rounded-xl p-4 shadow-md hover:shadow-2xl transition-all duration-200 h-[170px] gap-2 ">
                  <div className="flex justify-between ">
                    <span
                      className={`px-3 py-0.5 rounded-full h-5  uppercase text-xs font-semibold ${
                        elem.priority.toLowerCase() === "high"
                        ? "bg-red-500/10 border border-red-500/30 text-red-400"
                        : elem.priority.toLowerCase() === "low"
                        ? "bg-blue-500/10 border border-blue-500/30 text-blue-500"
                        : "bg-yellow-500/10 border border-yellow-500/30 text-yellow-500"
                      }`}
                      >
                      {elem.priority} PRIORITY
                    </span>
                    <div className="inline-flex items-center gap-1">
                      <button className=" cursor-pointer border  px-2 h-8 w-8 flex items-center opacity-100 transition-opacity border-zinc-600 rounded-xl"
                      onClick={()=>{
                        settask_id(elem.id)
                        seteditmodel(true)
                      }}
                      ><Pen className="text-xs text-zinc-400" size={14} /></button>
                      <button className=" cursor-pointer border  px-2 h-8 w-8 flex items-center opacity-100 transition-opacity border-zinc-600 rounded-xl"
                      onClick={async(e)=>{
                        try {
                          const respg=await api.delete(`update-task/${elem.id}/`)
                          setref((oldval)=>{return oldval +1})
                          settoastmessage('Task deleted successfully')
                          setshowToast(true)
                        }catch (error) {
                    settoastmessage(error.response?.data?.message||'Task Deletion Failed')
                    setshowToast(true)
                }finally{
                    setTimeout(() => {
                        setshowToast(false)
                        settoastmessage('')
                    }, 2000);
                }
                      }}
                      ><Trash2 className="text-xs text-zinc-400" size={14} /></button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-bold text-white text-sm line-clamp-1 group-hover:text-indigo-400 transition-colors">{elem.title}</h4>
                    <p className="text-zinc-400 text-xs line-clamp-2 min-h-[1.5rem]">
                      {elem.description}
                    </p>
                  </div>
                  <div className="flex  pt-3 justify-between border-t  border-zinc-950 text-[10px]">
                    <div className="flex inline-flex  gap-1 text-zinc-400 items-center">
                      <User className="font-bold text-lg text-indigo-400" size={17} />
                      <span className="pt-1 tracking-wide">M Talha(admin)</span>
                    </div>
                    <div className="flex inline-flex  gap-1 text-red-400 items-center">
                      <CalendarDays className="font-bold text-lg" size={17} />
                      <span className="pt-1 font-bold tracking-wide"> {new Date(elem.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
  })
  }
  return (
    <div className="min-h-screen pt-16  w-full overflow-x-hidden  bg-[rgb(11,15,25)]">
      <Navbar />
      <div className="flex flex-col  flex-1 pt-15 pl-10 pr-10 gap-6">
        {/* Back to dashboard */}
        <Link to={"/Dashboard"}>
          <span className="inline-flex items-center text-xs font-semibold text-zinc-400 hover:text-indigo-400 transition-colors gap-2">
            <MoveLeft className="font-bold text-lg" size={15} strokeWidth={3} />
            Back to Dashboard{" "}
          </span>
        </Link>
        {/* Team title etc... */}
        <div className="relative overflow-hidden bg-zinc-950/40 border border-zinc-800/80 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-5">
            <div className="flex  items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide text-white">
                {singleteam?.team_name|| 'loading...'}
              </h1>
              {admin?.username===user?.username && <span className="flex items-center h-6 gap-1 px-2.5 py-0.5 rounded-full bg-indigo-950/60 border border-indigo-900 text-[10px] mt-2 text-indigo-300 font-bold uppercase tracking-wider">
                <Shield strokeWidth={1.5} size={12} />
                Admin
              </span>}
            </div>
            <p className="text-zinc-400 text-sm max-w-2xl">
              {singleteam?.team_description || 'loading...'}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 font-medium">
              
              <span>Created: {singleteam?.created_at ? new Date(singleteam.created_at).toLocaleDateString() : 'Loading..'}</span>
              <span>Workspace ID: #{singleteam?.team_id || 'Loading..'}</span>
              <span>Creator: {singleteam?.created_by || 'Loading..'}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-5 self-start md:self-auto">
            <button className="flex items-center justify-center gap-2 py-2.5 px-5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl text-sm font-bold tracking-wide shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all cursor-pointer whitespace-nowrap" onClick={()=>{
              setaskmodel(true)
            }}>
              <span>+ Create Task</span>
            </button>
              {(taskmodel && <TaskModel />)}
            <button className="flex items-center justify-between  gap-2 py-2 px-4 bg-red-950/20 hover:bg-red-950/35 border border-red-900/50 text-red-300 hover:text-red-200 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap"
            onClick={()=>{
              setdelmodel(true)
            }}
            >
              
              <span className="flex inline-flex gap-2">
                <Trash strokeWidth={1.5} size={20} />
                Delete Team
              </span>
            </button>
            {delmodel && <DeleteModel />}
            
          </div>
        </div>
        {/* Team Statistics */}
        <div className="">
          <h2 className="tracking-tight text-lg text-white flex items-center gap-2 text-base font-bold">
            <TrendingUp
              className="text-indigo-400"
              size={18}
              strokeWidth={1.5}
            />
            Team Statistics
          </h2>
          <div className="grid pt-4 grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-zinc-900/40 border h-[90px] border-zinc-400 rounded-xl p-4">
              <p className="text-zinc-400 text-[10px] font-bold tracking-wide uppercase">
                Total Tasks
              </p>
              <p className="text-2xl font-black mt-1 text-white"> {stats?.total_tasks ?? 'Loading..'}</p>
            </div>
            <div className="bg-zinc-900/40 border h-[90px] border-zinc-400 rounded-xl p-4">
              <p className="text-zinc-400 text-[10px] font-bold tracking-wide uppercase">
                In Progress
              </p>
              <p className="text-2xl font-black mt-1 text-amber-400">{stats?.In_progress??'Loading..'}</p>
            </div>
            <div className="bg-zinc-900/40 border h-[90px] border-zinc-400 rounded-xl p-4">
              <p className="text-zinc-400 text-[10px] font-bold tracking-wide uppercase">
                completed
              </p>
              <p className="text-2xl font-black mt-1 text-green-400">{stats?.Completed??'Loading..'}</p>
            </div>
            <div className="bg-zinc-900/40 border h-[90px] border-zinc-400 rounded-xl p-4">
              <p className="text-red-400 text-[10px] font-bold tracking-wide uppercase">
                OverDue Tasks
              </p>
              <p className="text-2xl font-black mt-1 text-red-400">{stats?.over_due_tasks??'Loading..'}</p>
            </div>
          </div>
        </div>
        {/* Task canban Board*/}
        <div>
          <div>
            <h2 className="font-bold text-base text-white tracking-tight flex items-center gap-2">
              <Briefcase className="text-indigo-400" />
              Task canban Board
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
            <div className="bg-zinc-950/30 border border-zinc-900 rounded-2xl p-4 flex flex-col min-h-[500px]">
              <div className="flex justify-between">
                <div className="flex items-center inline-flex gap-2 ">
                  <span className="w-2.5 h-2.5 mt-1 rounded-full bg-blue-500">
                    .
                  </span>
                  <h3 className="text-white   font-bold ">To Do</h3>
                </div>
                <span className="px-2 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-[10px] text-zinc-400 font-semibold ">
                  {todo}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto  pr-1 gap-3">
                {to_do_tasks}
              </div>
            </div>
            <div className="bg-zinc-950/30 border border-zinc-900 rounded-2xl p-4 flex flex-col min-h-[500px]">
            <div className="flex justify-between">
                <div className="flex items-center inline-flex gap-2 ">
                  <span className="w-2.5 h-2.5 mt-1 rounded-full bg-yellow-600">
                    .
                  </span>
                  <h3 className="text-white   font-bold ">In Progress</h3>
                </div>
                <span className="px-2 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-[10px] text-zinc-400 font-semibold ">
                  {prog}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto  pr-1 gap-3">
                {In_prog_tasks}
              </div>
            </div>
            <div className="bg-zinc-950/30 border border-zinc-900 rounded-2xl p-4 flex flex-col min-h-[500px]">
            <div className="flex justify-between">
                <div className="flex items-center inline-flex gap-2 ">
                  <span className="w-2.5 h-2.5 mt-1 rounded-full bg-indigo-600">
                    .
                  </span>
                  <h3 className="text-white   font-bold ">In Review</h3>
                </div>
                <span className="px-2 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-[10px] text-zinc-400 font-semibold ">
                  {rev}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto  pr-1 gap-3">
                {In_Review}
              </div>
            </div>
            <div className="bg-zinc-950/30 border border-zinc-900 rounded-2xl p-4 flex flex-col min-h-[500px]">
            <div className="flex justify-between">
                <div className="flex items-center inline-flex gap-2 ">
                  <span className="w-2.5 h-2.5 mt-1 rounded-full bg-green-500">
                    .
                  </span>
                  <h3 className="text-white   font-bold ">Completed</h3>
                </div>
                <span className="px-2 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-[10px] text-zinc-400 font-semibold ">
                  {comp}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto pr-1 gap-3">
                {Completed_tasks}
              </div>
            </div>
          </div>
        </div>
        {/* Members and detail */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-9">
          {/* left box */}
          <div className="flex md:col-span-2 w-full flex-col gap-4 ">
            <div className="lg:col-span-2 space-y-4 bg-zinc-950/40 border border-zinc-800/80 rounded-2xl p-6">
              <h2 className="flex items-center gap-2 font-bold text-base tracking-tight text-white"><UsersRound className="text-indigo-500 text-xs" strokeWidth={1.5} size={18} />Team Members ({n})</h2>
            {Team_members}
            </div>
          </div>
          {/* right box */}
          <div className="bg-zinc-950/40 border  border-zinc-800/80 rounded-2xl p-6 space-y-5">
          {/* first */}
          <div className="space-y-3">
            <div className="space-y-1">
              <h3 className="text-md tracking-tight gap-2 font-bold text-white flex items-center gap-1.5"><Search className="text-indigo-400 text-xs "  size={18}/>Lookup Member Account</h3>
              <p className="text-zinc-500 text-[11px]">Enter Exact Username (Case-Sensitive, No Autocomplete)</p>
            </div>
            <form className="flex gap-2" 
            onSubmit={async(e)=>{
              e.preventDefault()
              try {
                const resp5=await api.get(`search-user/?q=${username}`)
                setsearchresult({
                username:resp5.data.username,
                email:resp5.data.email,
                userid:resp5.data.user_id,
              })
              setflag(true)
              } catch (err) {
                setsearchresult(null)
                setflag(false)
              }
            }}
            >
              <input type="text" placeholder="Enter Exact Username" className="flex px-3 py-1.5 border border-zinc-800 w-full bg-zinc-900 focus:border-indigo-500 rounded-xl text-white text-xs focus:outline-none focus:ring-indigo-500 transition-all"
              value={username}
              
              onChange={(e)=>{
                setusername(e.target.value)
                
              }}
              />

              <button type="submit" className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-semibold text-white transition-colors cursor-pointer"
              
              >Find</button>
            </form>
            {searchresult && <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-2">
              <div className="text-[11px]">
                <p className="text-zinc-400">
                  username: <span className="text-white font-bold">{searchresult.username}</span>
                </p>
                <p className="text-zinc-400">
                  Email: <span className="text-white font-bold">{searchresult.email}</span>
                </p>
                <p className="text-zinc-400">
                  User ID: <span className="text-white font-bold">{searchresult.userid}</span>
                </p>
              </div>
              </div> }
              {
                !flag && <p className="border border-red-400 text-red-500 text-xs font-medium rounded-2xl px-2">
                  User Not Found
                </p>
              }
          </div>
          {/* second */}
          <div className="space-y-3 ">
            <h3 className="flex items-center  text-sm text-white font-bold gap-1"><Plus strokeWidth={1.5} className="text-sm text-indigo-400" size={18} />Add Member to Team</h3>
            <form className="space-y-3.5"
            onSubmit={async(e)=>{
              e.preventDefault()
              try {
                const respx=await api.post(`add-team-mem/${param.id}/`,{role,user_id,team_id:param.id})
                settoastmessage('User Added Successfully')
                setshowToast(true)
                setref((oldval)=>{return oldval+1})
              } catch (error) {
                settoastmessage(error.response?.data?.message||'Failed to add User ')
                setshowToast(true)
              }finally{
                 setTimeout(() => {
                        setshowToast(false)
                        settoastmessage('')
                    }, 2000);
              }
            }}
             >
              <div>
                <label className="block text-zinc-400 text-[10px] font-semibold uppercase tracking-wider mb-1.5" >User Numeric ID</label>
                <input type="text" placeholder="e.g 42" className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs font-semibold focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 tarnsition-all text-white rounded-xl"
                onChange={(e)=>{return setuser_id(e.target.value)}}
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-[10px] font-semibold uppercase tracking-wider mb-1.5">Workspace Role</label>
                <select className="w-full px-3 pl-2 gap-5 py-2 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                onChange={(e)=>{return setrole(e.target.value)}}
                >
                  <option value="Member" className="bg-zinc-900 text-white">Member</option>
                  <option value="Admin" className="bg-zinc-900 text-white">Admin</option>
                </select>
              </div>
              <button className="w-full flex items-center justify-center gap-1 py-2 px-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/15 transition-all cursor-pointer">Add Member</button>
            </form>
          </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TeamDashboard;
