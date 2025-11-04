import {create} from "zustand"; 
import { axiosInstance } from "../lib/axios.js"; 
import {toast} from "react-hot-toast";  

export const useProblemStore = create((set)=>({
    problems:[], 
    problem:null, 
    solvedProblems:[], 
    isProblemsLoading:false, 
    isProblemLoading:false, 

    getAllProblems: async()=>{
        try {
            set({isProblemsLoading:true}) 

            const res = await axiosInstance.get("/problems/get-all-problem")
            set({problems:res.data.problems}) 



        } catch (error) {
            console.log("Error in getting All Problems", error) 
            toast.error("Error in getting Problems")
        } finally{
            set({isProblemsLoading:false})
        }
    }, 

    getProblemById: async(id)=>{
        try {
            set({isProblemLoading:true})    

            const res = await axiosInstance.get(`/problems/get-problem/${id}`)
            set({problem:res.data.problem})
            toast.success(res.data.message)
        } catch (error) {
            console.log("Error in getting one problem", error)
            toast.error("Error in getting single Problem")
        } finally{
            set({isProblemLoading:false})
        }
    }, 

    getSolvedProblemByUser: async()=>{
        try {
            const res = await axiosInstance.get("/problems/get-solved-problems") 
            set({solvedProblems:res.data.problems})
        } catch (error) {
            console.log("Error in getting solved problems", error)
            toast.error("Error getting solved problems");

        } 
    }
    
    
}))