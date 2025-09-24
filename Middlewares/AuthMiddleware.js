import { verifyToken } from "@clerk/backend";

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "No token provided" });
        }

        const token = authHeader.split(" ")[1];

        // Verify the Clerk JWT
        const { sub } = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY,
        });

        // Attach userId to request
        req.userId = sub;
        next();
    } catch (error) {
        console.error("Authentication error:", error.message);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

export default authMiddleware;
