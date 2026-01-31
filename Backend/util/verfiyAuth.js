import jwt from "jsonwebtoken";

export function verifyAuth(req, res, next) {
    // Get token from cookie or header
    let token = req.cookies?.token;

    if (!token) {
        //check header too
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];  // Extract token from "Bearer <token>"
        }
    }

    // If no token in cookie, check Authorization header
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7); // Remove 'Bearer ' prefix
        }
    }

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }


    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                error: "Invalid or expired token. Please log in again."
            });
        }

        req.user = user;  // attach decoded user info to request
        next();
    });
}
