import pool from "../config/db.js";

export async function getNotes(userId) {
    const query = `
    SELECT n.*, t.title as task_title
    FROM notes n
    LEFT JOIN tasks t ON n.task_id = t.id
    WHERE n.user_id = $1
    ORDER BY n.updated_at DESC`;
    const { rows } = await pool.query(query, [userId]);
    return rows;
}

export async function getNoteById(noteId, userId) {
    const query = `
    SELECT n.*, t.title as task_title
    FROM notes n
    LEFT JOIN tasks t ON n.task_id = t.id
    WHERE n.note_id = $1 AND n.user_id = $2`;
    const { rows } = await pool.query(query, [noteId, userId]);
    return rows[0];
}

export async function createNote(userId, noteData) {
    const { title, content, task_id } = noteData;
    const query = `
    INSERT INTO notes (title, content, task_id, user_id, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *`;
    const values = [title, content, task_id || null, userId, new Date(), new Date()];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

export async function updateNote(noteId, userId, updates) {
    const { title, content, task_id } = updates;
    const query = `
    UPDATE notes SET 
      title = COALESCE($1, title),
      content = COALESCE($2, content),
      task_id = COALESCE($3, task_id),
      updated_at = NOW()
    WHERE note_id = $4 AND user_id = $5
    RETURNING *`;
    const values = [title, content, task_id, noteId, userId];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

export async function deleteNote(noteId, userId) {
    const query = `DELETE FROM notes WHERE note_id = $1 AND user_id = $2 RETURNING *`;
    const { rows } = await pool.query(query, [noteId, userId]);
    return rows[0];
}