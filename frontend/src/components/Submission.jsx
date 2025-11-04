import React from "react"; 
import {CheckCircle2, XCircle, Clock, MemoryStick as Memory} from 'lucide-react'; 

const SubmissionResults = ({submission}) => {

    if (!submission || !submission.testcases) {
  return <div>Loading submission...</div>;
}


    //parse stringified array 
    const memoryArr = submission.memory ? JSON.parse(submission.memory) : []; 
    let timeArr = [];
    if (Array.isArray(submission.time)) {
        timeArr = submission.time.map(parseFloat);
    } else if (typeof submission.time === "string") {
        try {
            const parsed = JSON.parse(submission.time); 
            timeArr = Array.isArray(parsed) ? parsed.map(parseFloat) : [parseFloat(parsed)];
        } catch {
            timeArr = [parseFloat(submission.time)];
        }
    }

    console.log("---- DEBUG SUBMISSION ----");
    console.log("Raw submission.time:", submission.time);
    console.log("Type of submission.time:", typeof submission.time);
    console.log("Parsed timeArr before avg:", timeArr);


    //calculate averages 
    const avgMemory = memoryArr.map((m)=>parseFloat(m)).reduce((a,b)=> a+b, 0) / memoryArr.length 
    const avgTime = timeArr.map((t)=>parseFloat(t)).reduce((a,b)=>a+b,0) / timeArr.length 
   
    const passedTests = submission?.testcases?.filter(tc => tc.passed).length || 0; 
    const totalTests = submission.testcases.length; 
    const successRate = (passedTests / totalTests) * 100; 
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card bg-base-200 shadow-lg">
                    <div className="card-body p-4">
                        <h3 className="card-title">Status</h3> 
                        <div className={`text-lg font-bold ${submission.status === "Accepted" ? 'text-success':'text-error'}`}>
                            {submission.status}
                            {console.log("Submission Data", submission)}

                        </div>
                    </div>

                </div>

                <div className="card bg-base-200 shadow-lg">
                    <div className="card-body p-4">
                        <h3 className="card-title text-sm">Success Rate</h3>
                        <div className="text-lg font-bold">
                            {successRate.toFixed(1)}%
                        </div>
                    </div>
                </div>

                <div className="card bg-base-200 shadow-lg">
                    <div className="card-body p-4">
                        <h3 className="card-title text-sm">Avg Runtime</h3>
                        <div className="text-lg font-bold">
                            {avgTime.toFixed(3)}S
                        </div>
                    </div>
                </div> 

                <div className="card bg-base-200 shadow-lg">
                    <div className="card-body p-4">
                        <h3 className="card-title text-sm">Avg Memory</h3>
                        <div className="text-lg font-bold" >
                            {avgMemory.toFixed(1)}KB
                        </div>
                    </div>
                </div>
            </div>

            {/* Test Cases Results */} 
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title mb-4" >Test Case Results</h2>
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>Status</th>
                                    <th>Expected Output</th>
                                    <th>Your Output</th>
                                    <th>Memory</th>
                                    <th>Time</th>
                                </tr>
                            </thead> 
                            <tbody>
                                {submission.testcases.map((tc)=>(
                                    <tr key={tc.id}>
                                        <td>
                                            {tc.passed ?(
                                                <div className="flex items-center gap-2 text-success">
                                                    <CheckCircle2 className="w-5 h-5"/>
                                                </div>
                                            ) : (
                                                <div className="flex item-center gap-2 text-error">
                                                    <XCircle className="w-5 h-5" />
                                                    Failed 
                                                </div>
                                            )}
                                        </td>
                                        <td className="font-mono">{tc.expected}</td>
                                        <td className="font-mono" >{tc.stdout || 'null'}</td>
                                        <td>{tc.memory}</td>
                                        <td>{tc.time}</td>
                                    </tr>
                                ))

                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
 
} 

export default SubmissionResults;