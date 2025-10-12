import {db} from "../libs/db.js"; //db is not export default so we need to wrap this inside curly braces
import { getJudge0LanguageId, pollBatchResults, submitBatch } from "../libs/judge0.libs.js";


export const createProblem = async(req,res)=>{
    //going to get the all the data from the request body 
    const {title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions} = req.body 

    //going to check user role once again 
    if(req.user.role !== "ADMIN"){
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
                source_code:solutionCode|| "// solution missing",
                language_id:languageId,
                stdin:input ?? "",
                expected_output:output ?? ""
            }))

            const submissionResults = await submitBatch(submissions)

            const tokens = submissionResults.map((res)=>res.token);
            const results = await pollBatchResults(tokens); //this gives whole data of array array includes object for each test case 
            //each token and what is result of that token whether id is 3 or anything else id 
            //if its not 3 then there is problem in solution 

            for (let i=0; i<results.length; i++){
                const result = results[i];
                console.log("Result----", result);

                if(result.status.id !== 3){
                    return res.status(400).json({
                        error:`Testcase ${i+1} failed for language ${language}`
                    })
                }
            }

            //save the problem to our database 
            
        }

        const newProblem = await db.problem.create({
                data:{
                    title,description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions, userId:req.user.id
                }

            })
        return res.status(201).json({
            success:true,
            message:"Message Created Successfully",
            problem:newProblem
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:"Error while creating problem!!"
        })
    }


}
export const getAllProblems = async(req,res)=>{
    try {
        const problems = await db.problem.findMany();

        if(!problems){
            return res.status(404).json({
                error:"No problem found"
            })
        }

        res.status(200).json({
            success:true,
            message:"Message Fetched Successfully",
            problems 
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:"Error while fetching problems!!"
        })
    }
}
export const getProblemById = async(req,res)=>{
    const {id} = req.params 
    try {
        const problem = await db.problem.findUnique(
            {
                where:{
                    id
                }
            }
        )

        if(!problem){
            return res.status(404).json({
                error:"Problem not found"
            })
        }

        return res.status(201).json({
            success:true,
            message:"Message Created Successfully",
            problem
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:"Error while fetching problems!!"
        })
    }
}
export const updateProblem = async(req,res)=>{
    const {title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions} = req.body
    const {id} = req.params 
    if(!id) {
        return res.status(400).json({ error: "Missing problem id in URL params" });
    }

    //going to check user role once again 
    if(req.user.role !== "ADMIN"){
        return res.status(403).json({
            error:"You are not allowed to create a problem!!"
        })
    }

    const existingProblem = await db.problem.findUnique({
        where:{
            id
        }
    })

    if(!existingProblem){
        return res.status(404).json({
            error:"Problem not found"
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
                source_code:solutionCode|| "// solution missing",
                language_id:languageId,
                stdin:input ?? "",
                expected_output:output ?? ""
            }))

            const submissionResults = await submitBatch(submissions)

            const tokens = submissionResults.map((res)=>res.token);
            const results = await pollBatchResults(tokens); //this gives whole data of array array includes object for each test case 
            //each token and what is result of that token whether id is 3 or anything else id 
            //if its not 3 then there is problem in solution 

            for (let i=0; i<results.length; i++){
                const result = results[i];
                console.log("Result----", result);

                if(result.status.id !== 3){
                    return res.status(400).json({
                        error:`Testcase ${i+1} failed for language ${language}`
                    })
                }
            }

            //save the problem to our database 
            
        }

        const updatedProblem = await db.problem.update({
                where :{
                    id
                },
                data:{
                    title,description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions,updatedAt: new Date()
                }

            })
        return res.status(201).json({
            success:true,
            message:"Message updated Successfully",
            problem:updatedProblem 
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:"Error while updating problem!!"
        })
    }
}
export const deleteProblem = async(req,res)=>{
    const {id} = req.params 

    try {
        const problem = await db.problem.findUnique({
        where:{id}
    })

    if(!problem){
        return res.status(404).json({
            error:"problem not found"
        })
    }

    await db.problem.delete({
        where:{id} 
    })

    return res.status(200).json({
        success:true,
        message:"problem deleted successfully"
    })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error:"Error while deleting problem"
        })
    }
}

export const getAllProblemsSolvedByUser = async(req,res)=>{
    try {
        const problems = await db.problem.findMany({
            where:{
                solvedBy:{
                    some:{
                        userId:req.user.id 
                    }
                }
            }, 
            include:{
                solvedBy:{
                    where:{
                        userId:req.user.id 
                    }
                }
            }
        })

        res.status(200).json({
            success:true,
            message:"Problem Fetched Successfully!",
            problems 
        })
    } catch (error) {
        console.error("Error Fetching Problems: ", error);
        res.status(500).json({error:"Failed to fetch problems"})
    }
}