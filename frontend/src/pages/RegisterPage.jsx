import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {Mail,MoveRight,Lock,Layers,User} from 'lucide-react'
import { api } from '../Services/Api'
import useAuth from '../hooks/UseAuth'

const RegisterPage = () => {
    const navigate=useNavigate()
    const [password, setpassword] = useState('')
    const [confirmpassword, setconfirmpassword] = useState('')
    const [email, setemail] = useState('')
    const [username, setusername] = useState('')
    const [error, seterror] = useState('')
    const [...context] = useAuth();
    const { setaccesstoken, setuser } = context[14];
    const handler=async(e)=>{
            e.preventDefault()
            if ( password !=confirmpassword) {
              seterror('Password do not match')
            }else if (username && email && password) {
              try {
                const resp=await api.post('register/',{username,email,password})
                setaccesstoken(resp.data.access)
                localStorage.setItem("refresh_token", resp.data.refresh);
                navigate('/dashboard')  
              } catch (error) {
                const data=error.response?.data;
                if (data?.username) {
                  seterror(data.username[0])
                }else if (data?.password) {
                  seterror(data.password[0])
                }else if (data?.detail) {
                  seterror(data.detail)
                } else if (data?.message) {
                  seterror(data.message)
                } else{
                  seterror('Registration Failed')
                }
              }
              
            }else{
              seterror('Credentials are invalid')
            }
        }



  return (
    <div className='min-h-screen  bg-[rgb(11,15,25)]'>
      <header className='sticky top-0 z-40 w-full border-b border-zinc-700 bg-zinc-900/80 backdrop-blur-md'>
        <div className='container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl'>
          <a className='flex inline-flex gap-1 cursor-pointer' >
            <div className='bg-gradient-to-tr group-hover:brightness-110 transition-all duration-200 hover:bg-white/10 h-9 w-9  rounded-lg flex items-center px-2 from-indigo-500 to-violet-600'>
            <Layers className='text-white' />
            </div>
            <span className="text-white transition-all duration-200 group-hover:text-gray-300 tracking-wide  text-xl font-semibold px-2 mt-1">
          Task
          <span className="text-indigo-500 px-1">Flow</span>
        </span>
          </a>
        </div>
      </header>
      <div className='w-full max-w-lg mx-auto animate-slide-up mt-10 p-10'>
        {/* first */}
        <div className='flex flex-col items-center mb-8'>
          <div className='w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/20 mb-3'>
            <Layers className='text-white' />
          </div>
          <h3 className='text-3xl font-extrabold tracking-tight text-white'>Welcome Back</h3>
          <p className='mt-2 text-zinc-400 text-sm'>Sign in to manage your team's tasks</p>
        </div>
        {/* second */}
        <div className='bg-zinc-950/40 border border-zinc-800/80 rounded-2xl p-8 shadow-2xl backdrop-blur-xl'>
        <form className='space-y-4'
        onSubmit={handler}
        >
            {error &&<p className='text-red-500'>{error}</p>}
          <div className='flex flex-col gap-1'>
            <span className='block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2'>Username</span>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none'>
                <User className='text-zinc-500 text-xs ' size={15} />
              </div>
              <input type="text" placeholder='Enter Your Username' className='w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all'
              value={username}
              onChange={(e)=>{
                setusername(e.target.value)
              }}
               />
            </div>
          </div>
          <div className='flex flex-col gap-1'>
            <span className='block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2'>Email Address</span>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none'>
                
                <Mail  className='text-zinc-500 text-xs ' size={15} />
              </div>
              <input type="text" placeholder='You@gmail.com' className='w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all' 
              value={email}
              onChange={(e)=>{
                setemail(e.target.value)
              }}
              />
            </div>
          </div>
          <div className='flex flex-col gap-1'>
            <span className='block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2'>Password</span>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none'>
                <Lock  className='text-zinc-500 text-xs ' size={15} />
              </div>
              <input type="password" placeholder='Enter Your Password' className='w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all'
              value={password}
              onChange={(e)=>{
                setpassword(e.target.value)
              }}
               />
            </div>
          </div>
          <div className='flex flex-col gap-1'>
            <span className='block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2'>Confirm Password</span>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none'>
                <Lock  className='text-zinc-500 text-xs ' size={15} />
              </div>
              <input type="password" placeholder='Re-enter Your Password' className='w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all'
              value={confirmpassword}
              onChange={(e)=>{
                setconfirmpassword(e.target.value)
              }}
               />
            </div>
          </div>
          <button type='submit' className='w-full mt-6 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700  rounded-xl  tracking-wide shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all disabled:opacity-50 disabled:cursor-not-allowed group'>
          <span className='text-white gap-2 text-sm font-semibold flex inline-flex'>Create Account<MoveRight size={18} className='mt-1' /></span>
          </button>
        </form>
        <div className=' pt-6 border-t border-zinc-900 text-center'>
          <p className='text-zinc-400 text-xs flex justify-center items-center gap-2'>Already have an account?
            <Link to={'/'} className='text-indigo-400 hover:text-indigo-300 font-semibold transition-colors cursor-pointer'>Sign In</Link>
            </p>
        </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
