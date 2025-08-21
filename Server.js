//Library import section
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { supabase } from "./supabaseClient.js"
import authMiddleware from "./Middlewares/AuthMiddleware.js"
// import { supabase } from "@supabase/supabase-js"
// import authMiddle
// import pkg from "pg"

dotenv.config();
// const { Pool } = pkg;

const app = express();

app.use(cors());
app.use(express.json());

// // PostgreSQL pool connection
// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: { rejectUnauthorized: false },
// })

// app.get('/notes', async (req, res) => {
//     try {
//         const result = await pool.query("SELECT * FROM notes ORDER BY id ASC");
//         console.log(result);

//         res.json(result.rows);
//     } catch (error) {
//         console.log(err);
//         res.status(500).json({ error: "Database error" });

//     }
// })

//



app.use('/api', authMiddleware); // It checks is he authenticated

app.get("/api/tasks", async (req, res) => {
    try {
        const userId = req.userId;

        const { data, error } = await supabase
            .from("tasks").select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Supabase error:", error);
            return res.status(500).json({ error: "Failed to fetch tasks" });
        }

        console.log("Fetched tasks:", data);
        res.status(200).json(data);

    } catch (error) {

    }
})

app.post("/api/tasks", async (req, res) => {
    // Destructure all the fields from the request body
    const {
        title,
        description,
        priority,
        estimatedDuration,
        recurrence,
        reminder,
        due_date,
        tags,
    } = req.body;
    console.log(req.body);

    try {
        const userId = req.userId; // Get the user ID from the authentication middleware
        console.log("Using Auth Middleware provided userId :", userId);

        const { data, error } = await supabase
            .from("tasks")
            .insert({
                title,
                description,
                priority,
                estimatedDuration,
                recurrence,
                reminder,
                due_date,
                tags,
                user_id: userId // This links the task to the authenticated user
            })
            .select();

        if (error) {
            console.error("Supabase error:", error);
            return res.status(500).json({ error: "Failed to create task" });
        }
        console.log("DB returned data :", data);

        res.status(201).json(data[0]);
    } catch (err) {
        console.error("Server error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// PUT endpoint to update a specific task
app.put("/api/tasks/:id", async (req, res) => {
    const taskId = req.params.id;
    const userId = req.userId;
    const updateData = req.body;

    try {
        // First check if the task belongs to the user
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

        // Update the task
        const { data, error } = await supabase
            .from("tasks")
            .update(updateData)
            .eq("id", taskId)
            .eq("user_id", userId) // Double check user ownership
            .select();

        if (error) {
            console.error("Supabase error:", error);
            return res.status(500).json({ error: "Failed to update task" });
        }

        res.status(200).json(data[0]);
    } catch (err) {
        console.error("Server error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// DELETE endpoint to delete a specific task
app.delete("/api/tasks/:id", async (req, res) => {
    const taskId = req.params.id;
    const userId = req.userId;

    try {
        const { data, error } = await supabase
            .from("tasks")
            .delete()
            .eq("id", taskId)
            .eq("user_id", userId) // Only delete if it belongs to the user
            .select();

        if (error) {
            console.error("Supabase error:", error);
            return res.status(500).json({ error: "Failed to delete task" });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: "Task not found or unauthorized" });
        }

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (err) {
        console.error("Server error:", err);
        res.status(500).json({ error: "Server error" });
    }
});


app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});