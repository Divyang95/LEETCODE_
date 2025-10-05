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