import express from "express";
import Project from "../models/Project.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
    try{
        const {projectName, description} = req.body;

        const newProject = new Project({projectName, description});

        await newProject.save();

        res.status(201).json({message: "Project Created Successfully!", project: newProject});

    }catch(err){
        res.status(500).json({message: "Server Error", error: err.message});
    }
});

router.get("/", authMiddleware, async (req, res) => {
    try{
        const projects = await Project.find({});

        res.status(200).json({message: "Successfully found existing projects", projects: projects});
    }catch(err){
        res.status(500).json({message: "Server error", error: err.message});
    }
});

router.put("/:id/assign", authMiddleware, async (req, res) => {

    try{
        const projectId = req.params.id;
        const { userId } = req.body;

        const updatedProject = await Project.findByIdAndUpdate(projectId, {assignedTo: userId, status: "In Progress"}, {new: true});

        res.status(200).json({message: "Successfully assigned project", project: updatedProject});
    }catch(err){
        res.status(400).json({message: "Server Error", error: err.message});
    }

});

export default router;