//Library import section
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from "./supabaseClient.js";
import authMiddleware from "./Middlewares/AuthMiddleware.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api', authMiddleware);

// Error handler middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// GET tasks endpoint
app.get("/api/tasks", async (req, res, next) => {
    try {
        const userId = req.userId;
        console.log(`Fetching tasks for user: ${userId}`);

        const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Supabase error:", error);
            throw new Error("Failed to fetch tasks");
        }

        console.log(`Successfully fetched ${data.length} tasks`);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
});

// POST task endpoint
app.post("/api/tasks", async (req, res, next) => {
    try {
        const {
            title,
            description,
            priority,
            estimatedDuration,
            start_date,
            due_date,
            tags,
        } = req.body;

        console.log('Request body:', req.body);

        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }

        const userId = req.userId;
        console.log(`Creating task for user: ${userId}`);

        const { data, error } = await supabase
            .from("tasks")
            .insert({
                title,
                description,
                priority,
                estimatedDuration,
                start_date,
                due_date,
                tags,
                user_id: userId,
                created_at: new Date().toISOString(),
                status: 'Pending'
            })
            .select();

        if (error) {
            console.error("Supabase error:", error);
            throw new Error("Failed to create task");
        }

        console.log(`Task created successfully with ID: ${data[0].id}`);
        res.status(201).json(data[0]);
    } catch (error) {
        next(error);
    }
});

// PUT task endpoint
app.put("/api/tasks/:id", async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const userId = req.userId;
        const updateData = req.body;

        console.log(`Updating task ${taskId} for user ${userId}`);

        // Validate ownership
        const { data: existingTask, error: fetchError } = await supabase
            .from("tasks")
            .select("user_id")
            .eq("id", taskId)
            .single();

        if (fetchError || !existingTask) {
            return res.status(404).json({ error: "Task not found" });
        }

        if (existingTask.user_id !== userId) {
            return res.status(403).json({ error: "Unauthorized to update this task" });
        }

        // Update task
        const { data, error } = await supabase
            .from("tasks")
            .update({
                ...updateData,
                updated_at: new Date().toISOString()
            })
            .eq("id", taskId)
            .eq("user_id", userId)
            .select();

        if (error) {
            console.error("Supabase error:", error);
            throw new Error("Failed to update task");
        }

        console.log(`Task ${taskId} updated successfully`);
        res.status(200).json(data[0]);
    } catch (error) {
        next(error);
    }
});

// DELETE task endpoint
app.delete("/api/tasks/:id", async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const userId = req.userId;

        console.log(`Deleting task ${taskId} for user ${userId}`);

        // First check if task exists and belongs to user
        const { data: existingTask, error: fetchError } = await supabase
            .from("tasks")
            .select("user_id")
            .eq("id", taskId)
            .single();

        if (fetchError || !existingTask) {
            return res.status(404).json({ error: "Task not found" });
        }

        if (existingTask.user_id !== userId) {
            return res.status(403).json({ error: "Unauthorized to delete this task" });
        }

        // Delete task
        const { error } = await supabase
            .from("tasks")
            .delete()
            .eq("id", taskId)
            .eq("user_id", userId);

        if (error) {
            console.error("Supabase error:", error);
            throw new Error("Failed to delete task");
        }

        console.log(`Task ${taskId} deleted successfully`);
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        next(error);
    }
});

// Use error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API URL: http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});