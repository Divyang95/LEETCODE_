import express from "express";
import { authMiddleWare, checkAdmin } from "../middleware/auth.middleware.js";
import { createProblem, deleteProblem, getAllProblems, getAllProblemsSolvedByUser, getProblemById, updateProblem } from "../controllers/problem.controller.js";

const problemRoutes = express.Router();

problemRoutes.post("/create-problem", authMiddleWare, checkAdmin, createProblem);
problemRoutes.get("/get-all-problem", authMiddleWare, getAllProblems);
problemRoutes.get("/get-problem/:id", authMiddleWare, getProblemById);
problemRoutes.put("/update-problem/:id", authMiddleWare, checkAdmin, updateProblem);
problemRoutes.delete("/delete-problem/:id", authMiddleWare, checkAdmin, deleteProblem);
problemRoutes.get("/get-solved-problems", authMiddleWare, getAllProblemsSolvedByUser);



export default problemRoutes
