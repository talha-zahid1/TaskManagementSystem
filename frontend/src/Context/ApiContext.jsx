import { createContext, useEffect, useState } from "react"
import { api,setApiaccestoken } from "../Services/Api"

export const model_context = createContext()

const ApiContext = (props) => {
  const [user, setuser] = useState('')
  const [accesstoken, setaccesstoken] = useState(null)
  const [model, setmodel] = useState(false)
  const [refreshed, setrefreshed] = useState(0)
  const [taskmodel, settaskmodel] = useState(false)
  const [editmodel, seteditmodel] = useState(false)
  const [showToast, setshowToast] = useState(false)
  const [delmodel, setdelmodel] = useState(false)
  const [task_id, settask_id] = useState(0)
  const refresh = localStorage.getItem("refresh_token");
  const [loading, setloading] = useState(true)
  const [refreshed1, setrefreshed1] = useState(0)
  const [toastmessage, settoastmessage] = useState('')
  
  useEffect(() => {
    async function verify() {
      if (!refresh){
        setloading(false)
        return;
      } 
      try {
        const resp=await api.post('api/token/refresh/',{refresh:refresh})
        setaccesstoken(resp.data.access)
        setApiaccestoken(resp.data.access)
        const me=await api.get('me/')
        
        setuser(me.data)

      } catch (error) {
        console.log("Initial refresh failed");
      }finally{
        setloading(false)
      }
    }
    verify()
  }, [])
  


  return (
    <div>
      <model_context.Provider value={[model,setmodel,taskmodel,settaskmodel,delmodel,setdelmodel,editmodel,seteditmodel,task_id,settask_id,refreshed,setrefreshed,refreshed1,setrefreshed1,{
        user,
        setuser,
        accesstoken,
        setaccesstoken:(token)=>{
          setaccesstoken(token);
          setApiaccestoken(token);
        },
        loading,
        showToast,
        setshowToast,
        toastmessage,
        settoastmessage
      }]}>
        {props.children}
      </model_context.Provider>
    </div>
  )
}

export default ApiContext