import {create} from "zustand"; 
import {axiosInstance} from "../lib/axios.js"
import {toast} from 'react-hot-toast'


export const useAuthStore = create((set)=>({
    authUser:null,
    isSigninUp:false, 
    isLoggingIn:false, 
    isCheckingAuth:false, 

    checkAuth:async ()=>{
        set({isCheckingAuth:true})
        try {
            const res = await axiosInstance.get("/auth/check");
            console.log("CheckAuth response:",res.data);
            set({authUser:res.data.user})
        } catch (error) {
            console.log("❌ Error in Checking Auth:", error)
            set({authUser:null})
        }
        finally{
            set({
                isCheckingAuth:false 
            })
        }
    }, 

    signUp: async (data)=>{
        set({isSigninUp:true}); 
        try {
            const res = await axiosInstance.post("/auth/register", data); 
            set({authUser: res.data.user}); 
            toast.success(res.data.user); 


        } catch (error) {
            console.log("Error in SignIn up: ", error) 
            toast.error("Error in Signup")
        } finally {
            set({isSigninUp : false})
        }
    }, 


    login: async(data)=>{
        set({isLoggingIn: true}); 
        try {
            const res = await axiosInstance.post("/auth/login", data) 
            set({authUser: res.data.user}) 
            toast.success(res.data.message)
        } catch (error) {
            console.log("Error in Loging In", error);
            toast.error("Error in Loging In", error);
        } finally {
            set({isLoggingIn: false}); 
        }
    },
    
    logout: async()=>{
        try {
            await axiosInstance.post("/auth/logout"); 
            set({authUser: null}); 

            toast.success("Logout Successfully!")

        } catch (error) {
            console.log("Error in Logging Out", error)
            toast.error("Error in Logging Out!")
        }
    } 








})); 




