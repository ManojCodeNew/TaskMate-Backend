import pool from "../config/db.js";

export const createDrawing = async (userId, title, data, canvasWidth, canvasHeight) => {
    const query = `
        INSERT INTO drawings (user_id, title, data, canvas_width, canvas_height)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;
    const result = await pool.query(query, [userId, title, JSON.stringify(data), canvasWidth, canvasHeight]);
    return result.rows[0];
};

export const getDrawingsByUserId = async (userId) => {
    const query = `
        SELECT * FROM drawings 
        WHERE user_id = $1 
        ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
};

export const getDrawingById = async (id, userId) => {
    const query = `
        SELECT * FROM drawings 
        WHERE id = $1 AND user_id = $2
    `;
    const result = await pool.query(query, [id, userId]);
    return result.rows[0];
};

export const updateDrawing = async (id, userId, title, data, canvasWidth, canvasHeight) => {
    const query = `
        UPDATE drawings 
        SET title = $1, data = $2, canvas_width = $3, canvas_height = $4, updated_at = CURRENT_TIMESTAMP
        WHERE id = $5 AND user_id = $6
        RETURNING *
    `;
    const result = await pool.query(query, [title, JSON.stringify(data), canvasWidth, canvasHeight, id, userId]);
    return result.rows[0];
};

export const deleteDrawing = async (id, userId) => {
    const query = `
        DELETE FROM drawings 
        WHERE id = $1 AND user_id = $2
        RETURNING *
    `;
    const result = await pool.query(query, [id, userId]);
    return result.rows[0];
};