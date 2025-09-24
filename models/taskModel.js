import pool from "../config/db.js";

export async function getTasks(userId) {
    const query = `SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC`;
    const { rows } = await pool.query(query, [userId]);
    return rows;
}

export async function createTask(userId, taskData) {
    const { title, description, priority, estimatedDuration, start_date, due_date, tags } = taskData;
    const query = `
    INSERT INTO tasks (title, description, priority, estimatedDuration, start_date, due_date, tags, user_id, status, created_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *`;
    const values = [title, description, priority, estimatedDuration, start_date, due_date, JSON.stringify(tags || []), userId, "Pending", new Date()];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

export async function updateTask(taskId, userId, updates) {
    const { title, description, priority, estimatedDuration, start_date, due_date, tags, status } = updates;
    const query = `
    UPDATE tasks SET 
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      priority = COALESCE($3, priority),
      estimatedDuration = COALESCE($4, estimatedDuration),
      start_date = COALESCE($5, start_date),
      due_date = COALESCE($6, due_date),
      tags = COALESCE($7, tags),
      status = COALESCE($8, status),
      updated_at = NOW()
    WHERE id = $9 AND user_id = $10
    RETURNING *`;
    const values = [title, description, priority, estimatedDuration, start_date, due_date, tags ? JSON.stringify(tags) : null, status, taskId, userId];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

export async function deleteTask(taskId, userId) {
    const query = `DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *`;
    const { rows } = await pool.query(query, [taskId, userId]);
    return rows[0];
}
