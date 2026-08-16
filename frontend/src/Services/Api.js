import axios from "axios";

let Apiaccesstoken=null
export function setApiaccestoken(token) {
    Apiaccesstoken=token
}

export const api=axios.create({
    baseURL:import.meta.env.VITE_API_BASE_URL,
    withCredentials:true
})

api.interceptors.request.use((config)=>{
    
    if (Apiaccesstoken) {
        config.headers.Authorization=`Bearer ${Apiaccesstoken}`
    }
    return config
})


api.interceptors.response.use((response)=>{return response },async(error)=>{
    const excludedUrls = ['api/token/', 'api/token/refresh/', 'register/'];
    if (error.response?.status==401 && !excludedUrls.some(url => error.config?.url?.includes(url))  && !error.config._retry) {
        try {
            error.config._retry=true
            const refresh = localStorage.getItem("refresh_token");
        const resp=await api.post("api/token/refresh/",{refresh:refresh})
        setApiaccestoken(resp.data.access)
        error.config.headers.Authorization=`Bearer ${resp.data.access}`
        return api(error.config)
        } catch (refreshError) {
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error)
})