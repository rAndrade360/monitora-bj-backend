const jwt = require("jsonwebtoken");
const secret = process.env.AUTH_SECRET;
//Middleware de autenticação
module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).send({ error: "Token not provided" });

    const parts = authHeader.split(" ");

    if (!parts.length === 2)
        return res.status(401).send({ error: "Token error" });

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme))
        res.status(401).send({ error: "Token malformated" });

    jwt.verify(token, secret, (err, decoded) => {
        if (err) res.status(401).send({ error: "Token invalid" });
        req.userId = decoded.id;
        req.userPermission = decoded.permission;
        return next();
    });
};