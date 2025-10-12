import express from "express"
import { authMiddleWare } from "../middleware/auth.middleware.js"
import { addProblemToPlaylist, createPlaylist, deletePlaylist, getAllListDetails, getPlayListDetails, removeProblemFromPlaylist } from "../controllers/playlist.controller.js"

const playlistRoutes = express.Router()

playlistRoutes.get("/", authMiddleWare, getAllListDetails) 

playlistRoutes.get("/:playlistId", authMiddleWare, getPlayListDetails)

playlistRoutes.post("/create-playlist", authMiddleWare, createPlaylist)

playlistRoutes.post("/:playlistId/add-problem", authMiddleWare, addProblemToPlaylist)

playlistRoutes.delete("/:playlistId", authMiddleWare, deletePlaylist)

playlistRoutes.delete("/:playlistId/remove-problem", authMiddleWare, removeProblemFromPlaylist)

export default playlistRoutes