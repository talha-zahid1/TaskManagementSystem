import { useContext, useEffect, useState } from "react";
import { model_context } from "../Context/ApiContext";
import useAuth from "../hooks/UseAuth";

import React from 'react'
import { api } from "../Services/Api";
import { useNavigate, useParams } from "react-router-dom";


const EditModels = () => {
        const [...context]=useAuth()
        const param=useParams()
        const editmodel=context[6]
        const seteditmodel=context[7]
        const task_id=context[8]
        const settask_id=context[9]
        const {showToast,setshowToast,toastmessage,settoastmessage}=context[14]
        const [title, settitle] = useState('')
        const [description, setdescription] = useState('')
        const [status, setstatus] = useState('To Do')
        const [members, setmembers] = useState([])
        const [priority, setpriority] = useState('High')
        const [assignee, setassignee] = useState('')
        const [duedate, setduedate] = useState('')
        const navigate=useNavigate()
    
        useEffect(() => {
          async function get_resp() {
            const resp=await api.get(`get-team-mem/${param.id}`)
            setmembers(resp.data.members)
            if (resp.data.members.length > 0) {
                setassignee(resp.data.members[0].user_id)
            }
          }
          get_resp()
        }, [])
        
        
    
    
    
        if (!editmodel) return null
    
      return (
        <div className="fixed flex justify-center items-center top-16 z-40 inset-x-0 bottom-0 bg-black/50 backdrop-blur-sm">
            <div  className='bg-zinc-950 border-zinc-600 border   rounded-2xl w-[440px] min-h-[400px]  p-6 shadow-2xl animate-slide-up flex gap-2 m-3 flex-col '>
                <h2 className="text-lg flex items-start font-bold text-white">Edit Task</h2>
                <form className="space-y-4"
                onSubmit={async(e)=>{
                    e.preventDefault()
                    try {
                        const resp2=await api.put(`update-task/${task_id}/`,{team_id:param.id,title,description,status,priority,Due_date:duedate,assigned_to: assignee})
                        
                        settoastmessage('Task Updated')
                        setshowToast(true)
                        seteditmodel(false)
                        navigate(`/TeamDashboard/${param.id}`)
                        
                    } catch (error) {
                        settoastmessage(error.response?.data?.message||'Task Creation Failed')
                        setshowToast(true)
                    }finally{
                        setTimeout(() => {
                            setshowToast(false)
                            settoastmessage('')
                        }, 2000);
                    }
                }}
                >
                    <div className=" flex flex-col items-start gap-1">
                        <label className="block text-zinc-400 px-1 text-xs font-bold tracking-wider uppercase  mb-1.5">Title</label>
                        <input type="text" placeholder="Task title" className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all tracking-wider rounded-2xl  placeholder:font-normal text-white font-semibold text-xs "
                        value={title}
                        onChange={(e)=>{
                            settitle(e.target.value)
                        }}
                        />
                    </div>
                    <div className="flex flex-col items-start gap-1">
                        <label className="block text-zinc-400 px-1 text-xs font-bold tracking-wider uppercase  mb-1.5">Description</label>
                        <textarea placeholder="Task details..." className="w-full px-3.5 py-3 bg-zinc-900 border border-zinc-800 placeholder:text-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all rounded-2xl  placeholder:font-normal text-white font-semibold resize-none tracking-wider  text-xs h-[70px]"
                        value={description}
                        onChange={(e)=>{
                            setdescription(e.target.value)
                        }}
                        ></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col items-start gap-1">
                            <label className="block text-zinc-400 px-1 text-xs font-bold tracking-wider uppercase  mb-1.5">Assignee</label>
                            <select className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 gap-1 transition-all"
                            value={assignee}
                            onChange={(e)=>{
                                setassignee(e.target.value)
                                
                            }}
                             >
                                {members.map((elem,idx)=>{
                                    
                                    return <option key={elem.user_id} value={elem.user_id}>{elem.username} ({elem.role})</option>
                                }
                            )}
                                
                            </select>
                        </div>
                        <div className="flex flex-col items-start gap-1">
                            <label className="block text-zinc-400 px-1 text-xs font-bold tracking-wider uppercase  mb-1.5">priority</label>
                            <select className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 gap-1 transition-all"
                            value={priority}
                            onChange={(e)=>{setpriority(e.target.value)}
                            }
                            
                             >
                                <option value="High">High</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col items-start gap-1">
                            <label className="block text-zinc-400 px-1 text-xs font-bold tracking-wider uppercase  mb-1.5">status</label>
                            <select className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 gap-1 transition-all"
                            value={status}
                            onChange={(e)=>{setstatus(e.target.value)}}
                             >
                                <option value="To Do">To Do</option>
                                <option value="Progress">Progress</option>
                                <option value="Review">Review</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div className="flex flex-col items-start gap-1">
                            <label className="block text-zinc-400 px-1 text-xs font-bold tracking-wider uppercase  mb-1.5">due date</label>
                            <input type="date" className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 gap-1 transition-all" 
                            value={duedate}
                            onChange={(e)=>{setduedate(e.target.value)
                                
                            }}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
                        onClick={()=>{
                            
                            seteditmodel(false)
                        }}
                        >Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all cursor-pointer min-w-[5rem] flex items-center justify-center">
                        Save Changes
                        </button>
                    </div>
                </form>
              </div>
              </div>  
      ) 
}

export default EditModels
