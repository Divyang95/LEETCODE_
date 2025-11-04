import {create} from "zustand"; 
import {axiosInstance} from "../lib/axios.js"; 
import toast from "react-hot-toast"; 

export const useExecutionStore = create((set)=>({
    isExecuting:false, 
    submission:null, 

    executeCode: async(source_code, language_id, stdin, expected_outputs, problemId)=>{
        try {
            set({isExecuting: true, submission:null}); 
            console.log("Submission", JSON.stringify({
                source_code, language_id, stdin, expected_outputs, problemId 
            }))

            const res = await axiosInstance.post("/execute-code", {source_code, language_id, stdin, expected_outputs, problemId}) 
            // Validate response structure
            if (res.data?.submission) {
                // Ensure testcases exists
                const submission = {
                    ...res.data.submission,
                    testcases: res.data.submission.testCases || res.data.submission.testcases || [] // Fallback to empty array
                };
                
                set({submission}); 
                toast.success(res.data.message || "Code executed successfully!");
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error) {
            console.log("Error Executing Code" , error) 
            toast.error("Error in executing the code!")
        } finally {
            set({isExecuting: false})
        }
    }
}))




