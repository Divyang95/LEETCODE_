import jwt from "jsonwebtoken"
import { db } from "../libs/db.js";

export const authMiddleWare = async (req,res,next)=>{
    try {
        
        const token = req.cookies.jwt;
        if(!token){
            res.status(401).json({
                message:"Unauthorised - No Token Provided"
            })
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);

        } catch (error) {
            return res.status(401).json({
                message:"Unauthorised-Invalid token"
            })
        }

        const user = await db.user.findUnique({
            where:{
                id:decoded.id
            },
            select:{
                id:true,
                image:true,
                email:true,
                role:true,
                name:true 
            }
        })

        if(!user){
            return res.status(404).json({
                message:"user not found"
            })
        }

        req.user = user 
        next()

    } catch (error) {
        console.error("Error in jwt authentication:",error)
        res.status(500).json({message:"Error authenticating user"})
    }
}

export const checkAdmin = async(req,res,next)=>{
    try {
        const userId = req.user.id;
        const user = await db.user.findUnique({
            where:{
                id:userId 
            },
            select:{
                role:true
            }
        }) 

        if(!user || user.role !== "ADMIN"){
            return res.status(403).json({
                message:"Access Denied - Admins only"
            })
        }

        next()

    } catch (error) {
        console.error("Error in checking admin role", error);
        res.status(500).json({message:"Error in checking admin role"})
    }
}