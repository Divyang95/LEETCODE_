import axios from "axios";
import 'dotenv/config';

export const getJudge0LanguageId = (language)=>{
    const languageMap = {
        "PYTHON":71,
        "JAVA":62,
        "JAVASCRIPT":63
    }

    return languageMap[language.toUpperCase()] ?? null;
}

export const submitBatch =  async(submissions)=>{
    try {
        console.log("Sending to Judge0:", JSON.stringify({ submissions }, null, 2));
        const options = {
            method: 'POST',
            url: 'https://judge0-ce.p.sulu.sh/submissions/batch',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: process.env.JUDGE0_API_URL_SULU
            },
            data: {submissions}
        }
        const {data} = await axios.post(options.url, options.data, { headers: options.headers })

        console.log("Submissions results :", data)

        return data 
        
    } catch (error) {
        console.log("Error submitting to Judge0:", error.response?.data || error.message);
        throw error;
    }
    

}

const sleep = (ms)=>new Promise((resolve)=> setTimeout(resolve, ms))

export const pollBatchResults = async(tokens)=>{
    while(true){
        const url= 'https://judge0-ce.p.sulu.sh/submissions/batch'
        const headers= {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: process.env.JUDGE0_API_URL_SULU
            }
        
        const {data} = await axios.get(url, { headers, params: { tokens: tokens.join(',') } })

        const results = data.submissions;

        const isAllDone = results.every((r)=>r.status.id !==1 && r.status.id !==2) 

        if(isAllDone) return results 
        //we dont want to hit above axios endpoint immediately again and again we want that in between hitting the end points we need to break some time

        await sleep(1000)

    }
}