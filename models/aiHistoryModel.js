import pool from "../config/db.js";

export const saveAIHistory = async (userId, history) => {
    const query = `
        INSERT INTO ai_history (user_id, ai_history)
        VALUES ($1, $2)
        ON CONFLICT (user_id) 
        DO UPDATE SET ai_history = $2, updated_at = CURRENT_TIMESTAMP
        RETURNING *
    `;
    const result = await pool.query(query, [userId, JSON.stringify(history)]);
    return result.rows[0];
};

export const getAIHistory = async (userId) => {
    const query = `SELECT ai_history FROM ai_history WHERE user_id = $1`;
    const result = await pool.query(query, [userId]);
    return result.rows[0]?.ai_history || [];
};