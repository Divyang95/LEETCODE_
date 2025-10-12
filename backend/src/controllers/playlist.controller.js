import { db } from "../libs/db.js";

export const createPlaylist = async (req,res)=>{
    try {
        const {name, description} = req.body

        const userId = req.user.id 

        const playlist = await db.playlist.create({
            data:{
                name,
                description,
                userId  
            }
        }); 

        res.status(200).json({
            success:true, 
            message:"Playlist created Successfully",
            playlist 
        })

    } catch (error) {
        console.error("Error in creatig playlist:",error)
        res.status(500).json({error: "Failed to create playlist"})
    }
}

export const getAllListDetails = async (req,res)=>{
    try {
        const playlists = await db.playlist.findMany({
            where:{
                userId:req.user.id 
            }, 
            include:{
                problems:{
                    include:{
                        problem:true
                    }
                }
            }
        }); 

        res.status(200).json({
            success:true, 
            message:"Playlist Fetched Successfully!!",
            playlists 
        })

    } catch (error) {
        console.error("Error in getting All playlist:",error)
        res.status(500).json({error: "Failed to get All Playlist"})
    }
} 

export const getPlayListDetails = async (req,res)=>{
    const {playlistId} = req.params 
    try {
        const playlist = await db.playlist.findUnique({
            where:{
                userId:req.user.id,
                id:playlistId 
            }, 
            include:{
                problems:{
                    include:{
                        problem:true
                    }
                }
            }
        }); 
        //here as we go in schema there is problems field which it refernces to ProblemInPlaylist[] 
        //which is also model now we want whole problem schema so we give incluse problem model true so we will get whole problem schema
        //like wise priviously we done it for testcases   

        if(!playlist){
            return res.status(404).json({
                error:"Playlist not found"
            })
        }

        res.status(200).json({
            success:true, 
            message:"Playlist Fetched Successfully!!",
            playlist 
        })
    } catch (error) {
        console.error("Error in getting single playlist:",error)
        res.status(500).json({error: "Failed to get single playlist"})
    } 
}

export const addProblemToPlaylist = async (req,res)=>{
    const {playlistId} = req.params;
    const {problemIds} = req.body; 

    try {
        if(!Array.isArray(problemIds) || problemIds.length==0){
            return res.status(400).json({
                error:"Invalid or Missing problemsId"
            })
        }

        //create records for each problems in the playlist 
        const problemsInPlaylist = await db.problemsInPlaylist.createMany({
            data:problemIds.map((problemId)=>({
                playlistId,
                problemId 
            }))
        })

        res.status(201).json({
            success:true, 
            message:"Problems added successfully to the playlist",
            problemsInPlaylist 
        })


    } catch (error) {
        console.error("Error in adding problem in playlist:",error)
        res.status(500).json({error: "Error in adding problem in playlist:"})
    }
} 

export const deletePlaylist = async (req,res)=>{
    const {playlistId} = req.params 
    try {
        const deletedPlaylist = await db.playlist.delete({
            where:{
                id:playlistId
            }
        });

        res.status(200).json({
            success:true,
            message:"Playlist deleted Successfully",
            deletedPlaylist 
        })
    } catch (error) {
        console.error("Error deleting playlist:", error.message)
        res.status(500).json({error:"Failed to delete playlist!"})
    }
}

export const removeProblemFromPlaylist = async (req,res)=>{
    const {playlistId} = req.params 
    const {problemIds} =req.body 

    try {
        if(!Array.isArray(problemIds) || problemIds ===0){
            return res.status(400).json({error:"Invalid or missing problemIds"})
        }

        const deletedProblem = await db.problemsInPlaylist.deleteMany({
            where:{
                playlistId,
                problemId:{
                    in:problemIds 
                }
            }
        })

        res.status(200).json({
            success:true,
            message:"Problem Removed from playlist successfully", 
            deletedProblem
        })


    } catch (error) {
        console.error("Error deleting problems in playlist:", error.message)
        res.status(500).json({error:"Failed to delete problems in playlist!"})
    }
}