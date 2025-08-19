import { Clerk } from "@clerk/clerk-sdk-node";

const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: "No token provided" });
        }

        const token = authHeader.split(' ')[1];

        // Verify the JWT token
        const jwt = await clerk.verifyToken(token);

        // Attach the user's ID to the request object
        req.userId = jwt.sub;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ error: "Invalid or expired token" });
    }
};

export default authMiddleware;