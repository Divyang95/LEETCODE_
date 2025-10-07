import {db} from "../libs/db.js"; //db is not export default so we need to wrap this inside curly braces
import { getJudge0LanguageId, pollBatchResults, submitBatch } from "../libs/judge0.libs.js";


export const createProblem = async(req,res)=>{
    //going to get the all the data from the request body 
    const {title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions} = req.body 

    //going to check user role once again 
    if(req.user.id !== "ADMIN"){
        return res.status(403).json({
            error:"You are not allowed to create a problem!!"
        })
    }
    //loop through the data and create a problem for each of them 
    try {
        for(const [language, solutionCode] of Object.entries(referenceSolutions)){
            const languageId = getJudge0LanguageId(language)

            if(!languageId){
                return res.status(400).json({error:`Language {language} is not supported`})
            }

            const submissions = testcases.map(({input,output})=>({
                source_code:solutionCode,
                language_id:languageId,
                stdin:input,
                expected_output:output
            }))

            const submissionResults = await submitBatch(submissions)

            const tokens = submissionResults.map((res)=>res.token);
            const results = await pollBatchResults(tokens); //this gives whole data of array array includes object for each test case 
            //each token and what is result of that token whether id is 3 or anything else id 
            //if its not 3 then there is problem in solution 

            for (let i=0; i<results.length; i++){
                const result = results[i];

                if(result.status.id !== 3){
                    return res.status(400).json({
                        error:`Testcase ${i+1} failed for language ${language}`
                    })
                }
            }

            //save the problem to our database 
            const newProblem = await db.problem.create({
                data:{
                    title,description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions, userId:req.user.id
                }

            })

            return res.status(201).json(newProblem)
            

        }
    } catch (error) {
        
    }


}
export const getAllProblems = async(req,res)=>{}
export const getProblemById = async(req,res)=>{}
export const updateProblem = async(req,res)=>{}
export const deleteProblem = async(req,res)=>{}
export const getAllProblemsSolvedByUser = async(req,res)=>{}