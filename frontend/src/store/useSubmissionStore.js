import {create} from "zustand"; 
import {axiosInstance} from "../lib/axios.js" 
import toast from "react-hot-toast"; 


export const useSubmissionStore = create((set)=>({
    isLoading:false, 
    submissions:[],
    submission:null, 
    submissionCount:null, 
    
    
    getAllSubmissions: async ()=>{
        try {
            set({isLoading:true}) 
            const res =  await axiosInstance.get("/submission/get-all-submissions") 
            set({submissions: res.data.submissions})
            toast.success(res.data.message) 

        } catch (error) {
            console.log("Error in getting all submissions", error)
            toast.error("Error in getting all Submissions")
        } finally {
            set({isLoading:false})
        }
    }, 

    getSubmissionForProblem: async (problemId)=>{
        try {
            const res = await axiosInstance.get(`/submission/get-submission/${problemId}`); 
            set({submission:res.data.submissions});  

        } catch (error) {
            console.log("Error getting submissions for problem", error); 
            toast.error("Error in getting submissions for problem");
        }
    }, 

    getSubmissionCountForProblem: async(problemId)=>{
        try {
            const res = await axiosInstance.get(`/submission/get-submissions-count/${problemId}`)
            set({submissionCount:res.data.count})
        } catch (error) {
            console.log("Error in getting submission count for problem", error) 
            toast.error("Error in getting submission Count for problem")
        }
    }, 
    
    
        
       

}))