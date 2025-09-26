import express from "express";
import { saveDrawing, getDrawings, getDrawing, updateDrawingData, deleteDrawingData } from "../controllers/drawingController.js";
import authMiddleware from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, saveDrawing);
router.get("/", authMiddleware, getDrawings);
router.get("/:id", authMiddleware, getDrawing);
router.put("/:id", authMiddleware, updateDrawingData);
router.delete("/:id", authMiddleware, deleteDrawingData);

export default router;