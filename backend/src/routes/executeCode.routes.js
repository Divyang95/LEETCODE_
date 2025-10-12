import express from "express";
import { authMiddleWare } from "../middleware/auth.middleware.js";
import { executeCode } from "../controllers/executeCode.controller.js";

const executionRoute = express.Router()

executionRoute.post("/", authMiddleWare, executeCode)

export default executionRoute;