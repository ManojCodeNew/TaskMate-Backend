import express from "express";
import { saveDrawing, getDrawings, getDrawing, updateDrawingData, deleteDrawingData } from "../controllers/drawingController.js";
import { authenticateToken } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, saveDrawing);
router.get("/", authenticateToken, getDrawings);
router.get("/:id", authenticateToken, getDrawing);
router.put("/:id", authenticateToken, updateDrawingData);
router.delete("/:id", authenticateToken, deleteDrawingData);

export default router;