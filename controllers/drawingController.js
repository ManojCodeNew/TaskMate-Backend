import { createDrawing, getDrawingsByUserId, getDrawingById, updateDrawing, deleteDrawing } from "../models/drawingModel.js";

export async function saveDrawing(req, res, next) {
    try {
        const { title, drawingData, canvasWidth, canvasHeight } = req.body;
        if (!title || !drawingData) {
            return res.status(400).json({ error: "Title and drawing data are required" });
        }

        const drawing = await createDrawing(req.userId, title, drawingData, canvasWidth || 800, canvasHeight || 600);
        res.status(201).json(drawing);
    } catch (err) {
        next(err);
    }
}

export async function getDrawings(req, res, next) {
    try {
        const drawings = await getDrawingsByUserId(req.userId);
        res.status(200).json(drawings);
    } catch (err) {
        next(err);
    }
}

export async function getDrawing(req, res, next) {
    try {
        const drawing = await getDrawingById(req.params.id, req.userId);
        if (!drawing) {
            return res.status(404).json({ error: "Drawing not found" });
        }
        res.status(200).json(drawing);
    } catch (err) {
        next(err);
    }
}

export async function updateDrawingData(req, res, next) {
    try {
        const { title, drawingData, canvasWidth, canvasHeight } = req.body;
        const drawing = await updateDrawing(req.params.id, req.userId, title, drawingData, canvasWidth, canvasHeight);
        if (!drawing) {
            return res.status(404).json({ error: "Drawing not found" });
        }
        res.status(200).json(drawing);
    } catch (err) {
        next(err);
    }
}

export async function deleteDrawingData(req, res, next) {
    try {
        const drawing = await deleteDrawing(req.params.id, req.userId);
        if (!drawing) {
            return res.status(404).json({ error: "Drawing not found" });
        }
        res.status(200).json({ message: "Drawing deleted successfully" });
    } catch (err) {
        next(err);
    }
}