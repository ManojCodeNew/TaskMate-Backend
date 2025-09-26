import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authMiddleware from "./middlewares/authMiddleware.js";
import taskRoutes from "./routes/taskRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import drawingRoutes from "./routes/drawingRoutes.js";
import aiHistoryRoutes from "./routes/aiHistoryRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Protect all /api routes with Clerk auth middleware
app.use("/api", authMiddleware);

// Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/drawings", drawingRoutes);
app.use("/api/ai-history", aiHistoryRoutes);

// Global Error handler
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}/api`);
});
