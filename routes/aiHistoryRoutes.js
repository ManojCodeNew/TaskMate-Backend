import express from "express";
import { saveHistory, getHistory } from "../controllers/aiHistoryController.js";
import authMiddleware from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/save", authMiddleware, saveHistory);
router.get("/", authMiddleware, getHistory);

export default router;