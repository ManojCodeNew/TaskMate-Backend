import express from "express";
import { fetchNotes, fetchNoteById, createNote, updateNote, removeNote } from "../controllers/noteController.js";

const router = express.Router();

router.get("/", fetchNotes);
router.get("/:id", fetchNoteById);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", removeNote);

export default router;
