import express from "express";
import { fetchTasks, createTask, updateTask, removeTask } from "../controllers/taskController.js";

const router = express.Router();

router.get("/", fetchTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", removeTask);

export default router;
