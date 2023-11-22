// middlewares/auth.js
const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) { 
            return res.status(403).json({ error: 'Token invalid' });
        } else {
            req.user = user;
            next();
        }
    });
}

module.exports = { verifyToken };
