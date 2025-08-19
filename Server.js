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
app.use('/api', authMiddleware);
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


app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});