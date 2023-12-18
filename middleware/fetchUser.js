const jwt = require('jsonwebtoken');
const JWT_SECRET = 'RAJSHAH';

// Middleware to fetch user from JWT token
const fetchUser = (req, res, next) => {
    // Get user from JWT token 
    const token = req.header('auth-token');

    // Check if token is provided
    if (!token) {
        return res.status(401).send({ error: "Authenticate using a valid token" });
    }

    try {
        // Verify the token and extract user data
        const data = jwt.verify(token, JWT_SECRET);
        
        // Attach user data to the request object
        req.user = data.user;

        // Move to the next middleware or route handler
        next();
    } catch (error) {
        // Handle token verification failure
        res.status(401).send({ error: "Authenticate using a valid token" });
    }
}

// Export the middleware function
module.exports = fetchUser;
