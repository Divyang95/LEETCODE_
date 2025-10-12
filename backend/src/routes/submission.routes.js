import express from "express";
import { authMiddleWare } from "../middleware/auth.middleware.js";
import { getAllSubmission, getAllTheSubmissionsForProblem, getSubmissionsForProblem } from "../controllers/submission.controller.js";


const submissionRoutes = express.Router();

submissionRoutes.get("/get-all-submissions", authMiddleWare, getAllSubmission);
submissionRoutes.get("/get-submission/:problemId", authMiddleWare, getSubmissionsForProblem) 

submissionRoutes.get("/get-submissions-count/:problemId", authMiddleWare, getAllTheSubmissionsForProblem)

export default submissionRoutes