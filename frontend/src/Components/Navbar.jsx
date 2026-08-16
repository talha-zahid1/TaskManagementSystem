import {Link} from "react-router-dom";
import {Check, Layers, User, LogOut } from "lucide-react";
import useAuth from "../hooks/UseAuth";


const Navbar = () => {
  const [...context]=useAuth()
  const {user}=context[14]
  const {showToast,setshowToast,toastmessage}=context[14]
  
  return (
    <div className="h-16 fixed top-0 left-0 right-0  md:h-18 z-50  bg-slate-950 flex  items-center px-3">
      <div className="flex mr-auto justify-between rounded-xl  items-start cursor-pointer group ">
        {showToast && <div className=' z-[100] fixed top-6 right-6  '>
        <p className='border border-zinc-700 h-10 text-zinc-400 bg-zinc-950 rounded-2xl text-xs flex inline-flex items-center gap-2 font-semibold px-2'>
          <Check className=' text-white  border-none p-0.5 h-6 w-6 bg-indigo-500 rounded-4xl font-bold  text-2xl' size={12} />
          {toastmessage}</p>
        </div>}
        <div className="bg-gradient-to-tr group-hover:brightness-110 transition-all duration-200 hover:bg-white/10 h-9 w-9  rounded-lg flex items-center px-2 from-indigo-500 to-violet-600 ">
          <Layers className="text-white  " size={66} strokeWidth="2" />
        </div>
        <span className="text-white transition-all duration-200 group-hover:text-gray-300 tracking-wide text-xl font-semibold px-2 mt-1">
          Task
          <span className="text-indigo-500">Flow</span>
        </span>
      </div>
      <div className="flex  justify-between items-start gap-7">
        <Link
          className="text-zinc-400 mt-2 hover:text-white cursor-pointer text-sm font-semibold tracking-wide"
          to={'/dashboard'}
        >
          Dashboard
        </Link>
        <div className="rounded-2xl border border-white/10 px-2  gap-2 w-25 bg-slate-900 h-8 flex  items-center">
          <User
            className="text-indigo-400 text-lg "
            size={16}
            strokeWidth={1}
          />
          <span className="text-slate-100   text-xs font-semibold tracking-wide">
            {user?.username || 'loading...'}
          </span>
        </div>
        <Link
          to={"/"}
          className="flex group relative cursor-pointer items-center rounded-2xl border bg-slate-900 gap-2 px-2 border-white/10 h-8 w-25 "
        >
          <LogOut
            size={16}
            className="group-hover:text-rose-300 text-slate-100 "
          />
          <span className="text-slate-100   group-hover:text-rose-300 text-xs font-semibold tracking-wide">
            Sign Out
          </span>
          <div className="absolute left-1/2 flex justify-between-translate-x-1/2 top-10 bg-white text-black text-xs px-2 py-1 w-24 opacity-0 group-hover:opacity-100 transition-opacity">
            Log Out
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
