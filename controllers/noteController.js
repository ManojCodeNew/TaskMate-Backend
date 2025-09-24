import * as NoteModel from "../models/noteModel.js";

export async function fetchNotes(req, res, next) {
    try {
        const notes = await NoteModel.getNotes(req.userId);
        res.status(200).json(notes);
    } catch (err) {
        next(err);
    }
}

export async function fetchNoteById(req, res, next) {
    try {
        const note = await NoteModel.getNoteById(req.params.id, req.userId);
        if (!note) return res.status(404).json({ error: "Note not found" });
        res.status(200).json(note);
    } catch (err) {
        next(err);
    }
}

export async function createNote(req, res, next) {
    try {
        if (!req.body.title || !req.body.content) return res.status(400).json({ error: "Title and content are required" });
        const note = await NoteModel.createNote(req.userId, req.body);
        res.status(201).json(note);
    } catch (err) {
        next(err);
    }
}

export async function updateNote(req, res, next) {
    try {
        const note = await NoteModel.updateNote(req.params.id, req.userId, req.body);
        if (!note) return res.status(404).json({ error: "Note not found" });
        res.status(200).json(note);
    } catch (err) {
        next(err);
    }
}

export async function removeNote(req, res, next) {
    try {
        const note = await NoteModel.deleteNote(req.params.id, req.userId);
        if (!note) return res.status(404).json({ error: "Note not found" });
        res.status(200).json({ message: "Note deleted successfully" });
    } catch (err) {
        next(err);
    }
}
