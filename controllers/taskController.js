import * as TaskModel from "../models/taskModel.js";

export async function fetchTasks(req, res, next) {
    try {
        const tasks = await TaskModel.getTasks(req.userId);
        res.status(200).json(tasks);
    } catch (err) {
        next(err);
    }
}

export async function createTask(req, res, next) {
    try {
        if (!req.body.title) return res.status(400).json({ error: "Title is required" });
        const task = await TaskModel.createTask(req.userId, req.body);
        res.status(201).json(task);
    } catch (err) {
        next(err);
    }
}

export async function updateTask(req, res, next) {
    try {
        const task = await TaskModel.updateTask(req.params.id, req.userId, req.body);
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.status(200).json(task);
    } catch (err) {
        next(err);
    }
}

export async function removeTask(req, res, next) {
    try {
        const task = await TaskModel.deleteTask(req.params.id, req.userId);
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (err) {
        next(err);
    }
}
