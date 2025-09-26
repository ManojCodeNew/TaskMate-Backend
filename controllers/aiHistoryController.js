import { saveAIHistory, getAIHistory } from "../models/aiHistoryModel.js";

export async function saveHistory(req, res, next) {
    try {
        const { history } = req.body;
        await saveAIHistory(req.userId, history);
        res.status(200).json({ message: "History saved" });
    } catch (err) {
        next(err);
    }
}

export async function getHistory(req, res, next) {
    try {
        const history = await getAIHistory(req.userId);
        res.status(200).json(history);
    } catch (err) {
        next(err);
    }
}